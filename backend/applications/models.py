from django.db import models

class Application(models.Model):
    STATUS_PENDING = "pending"
    STATUS_APPROVED = "approved"
    STATUS_DECLINED = "declined"
    STATUS_DISMISSED = "dismissed"
    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_APPROVED, "Approved"),
        (STATUS_DECLINED, "Declined"),
        (STATUS_DISMISSED, "Dismissed"),
    ]

    title = models.CharField(max_length=20, blank=True, default="")
    first_name = models.CharField(max_length=100, blank=True, default="")
    middle_name = models.CharField(max_length=100, blank=True, default="")
    last_name = models.CharField(max_length=100, blank=True, default="")
    dob = models.DateField(blank=True, null=True)

    id_number = models.CharField(max_length=50, blank=True, default="")
    equity_code = models.CharField(max_length=50, blank=True, default="")
    nationality = models.CharField(max_length=100, blank=True, default="")
    gender = models.CharField(max_length=50, blank=True, default="")
    home_language = models.CharField(max_length=100, blank=True, default="")
    socio_economic_status = models.CharField(max_length=50, blank=True, default="")
    disability_status = models.CharField(max_length=50, blank=True, default="")

    home_address = models.TextField(blank=True, default="")
    province = models.CharField(max_length=100, blank=True, default="")
    highest_qualification = models.CharField(max_length=100, blank=True, default="")

    opportunity_type = models.CharField(max_length=50, blank=True, default="")
    opportunity_title = models.CharField(max_length=200, blank=True, default="")

    id_file = models.FileField(upload_to="applications/id/", blank=True, null=True)
    qualification_file = models.FileField(
        upload_to="applications/qualification/", blank=True, null=True
    )
    other_file = models.FileField(upload_to="applications/other/", blank=True, null=True)

    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.first_name} {self.last_name} ({self.opportunity_type}: {self.opportunity_title})"


class Learner(models.Model):
    STATUS_ACTIVE = "active"
    STATUS_DISMISSED = "dismissed"
    STATUS_CHOICES = [
        (STATUS_ACTIVE, "Active"),
        (STATUS_DISMISSED, "Dismissed"),
    ]

    application = models.OneToOneField(
        Application, on_delete=models.SET_NULL, null=True, blank=True
    )

    title = models.CharField(max_length=20, blank=True, default="")
    first_name = models.CharField(max_length=100, blank=True, default="")
    middle_name = models.CharField(max_length=100, blank=True, default="")
    last_name = models.CharField(max_length=100, blank=True, default="")
    dob = models.DateField(blank=True, null=True)

    id_number = models.CharField(max_length=50, blank=True, default="")
    equity_code = models.CharField(max_length=50, blank=True, default="")
    nationality = models.CharField(max_length=100, blank=True, default="")
    gender = models.CharField(max_length=50, blank=True, default="")
    home_language = models.CharField(max_length=100, blank=True, default="")
    socio_economic_status = models.CharField(max_length=50, blank=True, default="")
    disability_status = models.CharField(max_length=50, blank=True, default="")

    home_address = models.TextField(blank=True, default="")
    province = models.CharField(max_length=100, blank=True, default="")
    highest_qualification = models.CharField(max_length=100, blank=True, default="")

    opportunity_type = models.CharField(max_length=50, blank=True, default="")
    opportunity_title = models.CharField(max_length=200, blank=True, default="")

    id_file = models.FileField(upload_to="learners/id/", blank=True, null=True)
    qualification_file = models.FileField(
        upload_to="learners/qualification/", blank=True, null=True
    )
    other_file = models.FileField(upload_to="learners/other/", blank=True, null=True)

    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default=STATUS_ACTIVE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.first_name} {self.last_name} ({self.status})"
