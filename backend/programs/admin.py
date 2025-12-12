from django.contrib import admin

from .models import Program


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "is_active", "created_at")
    search_fields = ("title", "slug")
    list_filter = ("is_active", "created_at")
