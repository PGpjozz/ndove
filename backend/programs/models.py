from django.db import models
from django.utils.text import slugify


class Program(models.Model):
    TYPE_LEARNERSHIP = "learnership"
    TYPE_INTERNSHIP = "internship"
    TYPE_CHOICES = [
        (TYPE_LEARNERSHIP, "Learnership"),
        (TYPE_INTERNSHIP, "Internship"),
    ]

    title = models.CharField(max_length=200)
    type = models.CharField(
        max_length=20, choices=TYPE_CHOICES, default=TYPE_LEARNERSHIP
    )
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title) or "program"
            candidate = base
            i = 2
            while Program.objects.filter(slug=candidate).exclude(pk=self.pk).exists():
                candidate = f"{base}-{i}"
                i += 1
            self.slug = candidate
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.title
