from rest_framework import serializers

from .models import GalleryPost


class GalleryPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryPost
        fields = "__all__"
        read_only_fields = ["id", "created_at"]
