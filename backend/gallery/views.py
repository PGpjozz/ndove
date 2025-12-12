from rest_framework import viewsets

from config.permissions import IsAdminOrReadOnly

from .models import GalleryPost
from .serializers import GalleryPostSerializer


class GalleryPostViewSet(viewsets.ModelViewSet):
    serializer_class = GalleryPostSerializer
    queryset = GalleryPost.objects.all()
    permission_classes = [IsAdminOrReadOnly]
