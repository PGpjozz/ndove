from rest_framework import permissions, viewsets

from .models import Enquiry
from .serializers import EnquirySerializer


class EnquiryViewSet(viewsets.ModelViewSet):
    serializer_class = EnquirySerializer
    queryset = Enquiry.objects.all()

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
