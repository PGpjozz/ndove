from django.core.validators import FileExtensionValidator
from django.db import models

class CompanyProfile(models.Model):
    name = models.CharField(max_length=200, default="Enerhu Business Enterprise")
    pdf = models.FileField(
        upload_to="company_profile/",
        blank=True,
        null=True,
        validators=[FileExtensionValidator(["pdf"])],
    )

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name
