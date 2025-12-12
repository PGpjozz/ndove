from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Application, Learner
from .serializers import ApplicationSerializer, LearnerSerializer


class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    queryset = Application.objects.all()

    def get_queryset(self):
        qs = super().get_queryset()
        status_filter = self.request.query_params.get("status")
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def perform_create(self, serializer):
        serializer.save(status=Application.STATUS_PENDING)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAdminUser])
    def decline(self, request, pk=None):
        app = self.get_object()
        app.status = Application.STATUS_DECLINED
        app.save(update_fields=["status"])
        return Response(self.get_serializer(app).data)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        app = self.get_object()

        if Learner.objects.filter(application=app).exists():
            learner = Learner.objects.get(application=app)
            if learner.status != Learner.STATUS_ACTIVE:
                learner.status = Learner.STATUS_ACTIVE
                learner.save(update_fields=["status"])
        else:
            learner = Learner(
                application=app,
                title=app.title,
                first_name=app.first_name,
                middle_name=app.middle_name,
                last_name=app.last_name,
                dob=app.dob,
                id_number=app.id_number,
                equity_code=app.equity_code,
                nationality=app.nationality,
                gender=app.gender,
                home_language=app.home_language,
                socio_economic_status=app.socio_economic_status,
                disability_status=app.disability_status,
                home_address=app.home_address,
                province=app.province,
                highest_qualification=app.highest_qualification,
                opportunity_type=app.opportunity_type,
                opportunity_title=app.opportunity_title,
                id_file=app.id_file,
                qualification_file=app.qualification_file,
                other_file=app.other_file,
                status=Learner.STATUS_ACTIVE,
            )
            learner.save()

        app.status = Application.STATUS_APPROVED
        app.save(update_fields=["status"])
        return Response(LearnerSerializer(learner).data, status=status.HTTP_201_CREATED)


class LearnerViewSet(viewsets.ModelViewSet):
    serializer_class = LearnerSerializer
    queryset = Learner.objects.all()
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        qs = super().get_queryset()
        status_filter = self.request.query_params.get("status")
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAdminUser])
    def dismiss(self, request, pk=None):
        learner = self.get_object()
        learner.status = Learner.STATUS_DISMISSED
        learner.save(update_fields=["status"])
        if learner.application_id:
            Application.objects.filter(pk=learner.application_id).update(
                status=Application.STATUS_DISMISSED
            )
        return Response(self.get_serializer(learner).data)
