from rest_framework import viewsets

from config.permissions import IsAdminOrReadOnly

from .models import Program
from .serializers import ProgramSerializer


class ProgramViewSet(viewsets.ModelViewSet):
    serializer_class = ProgramSerializer
    queryset = Program.objects.all()
    permission_classes = [IsAdminOrReadOnly]


class OpportunityViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProgramSerializer

    def get_queryset(self):
        return Program.objects.filter(is_active=True)
