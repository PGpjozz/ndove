from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("applications", "0002_remove_application_cv_remove_application_email_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="application",
            name="status",
            field=models.CharField(
                choices=[
                    ("pending", "Pending"),
                    ("approved", "Approved"),
                    ("declined", "Declined"),
                    ("dismissed", "Dismissed"),
                ],
                default="pending",
                max_length=20,
            ),
        ),
        migrations.CreateModel(
            name="Learner",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(blank=True, default="", max_length=20)),
                ("first_name", models.CharField(blank=True, default="", max_length=100)),
                ("middle_name", models.CharField(blank=True, default="", max_length=100)),
                ("last_name", models.CharField(blank=True, default="", max_length=100)),
                ("dob", models.DateField(blank=True, null=True)),
                ("id_number", models.CharField(blank=True, default="", max_length=50)),
                ("equity_code", models.CharField(blank=True, default="", max_length=50)),
                ("nationality", models.CharField(blank=True, default="", max_length=100)),
                ("gender", models.CharField(blank=True, default="", max_length=50)),
                ("home_language", models.CharField(blank=True, default="", max_length=100)),
                ("socio_economic_status", models.CharField(blank=True, default="", max_length=50)),
                ("disability_status", models.CharField(blank=True, default="", max_length=50)),
                ("home_address", models.TextField(blank=True, default="")),
                ("province", models.CharField(blank=True, default="", max_length=100)),
                ("highest_qualification", models.CharField(blank=True, default="", max_length=100)),
                ("opportunity_type", models.CharField(blank=True, default="", max_length=50)),
                ("opportunity_title", models.CharField(blank=True, default="", max_length=200)),
                ("id_file", models.FileField(blank=True, null=True, upload_to="learners/id/")),
                (
                    "qualification_file",
                    models.FileField(blank=True, null=True, upload_to="learners/qualification/"),
                ),
                ("other_file", models.FileField(blank=True, null=True, upload_to="learners/other/")),
                (
                    "status",
                    models.CharField(
                        choices=[("active", "Active"), ("dismissed", "Dismissed")],
                        default="active",
                        max_length=20,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "application",
                    models.OneToOneField(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="applications.application",
                    ),
                ),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
    ]
