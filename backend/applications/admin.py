from django.contrib import admin

from .models import Application, Learner


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = (
        "first_name",
        "last_name",
        "id_number",
        "opportunity_type",
        "opportunity_title",
        "status",
        "created_at",
    )
    search_fields = (
        "first_name",
        "middle_name",
        "last_name",
        "id_number",
        "opportunity_title",
    )
    list_filter = ("status", "created_at")


@admin.register(Learner)
class LearnerAdmin(admin.ModelAdmin):
    list_display = (
        "first_name",
        "last_name",
        "id_number",
        "opportunity_type",
        "opportunity_title",
        "status",
        "created_at",
    )
    search_fields = (
        "first_name",
        "middle_name",
        "last_name",
        "id_number",
        "opportunity_title",
    )
    list_filter = ("status", "created_at")
