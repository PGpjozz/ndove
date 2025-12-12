from django.contrib import admin

from .models import GalleryPost


@admin.register(GalleryPost)
class GalleryPostAdmin(admin.ModelAdmin):
    list_display = ("title", "created_at")
    search_fields = ("title", "caption")
    list_filter = ("created_at",)
