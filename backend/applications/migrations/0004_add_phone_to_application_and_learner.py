from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("applications", "0003_application_status_and_learner"),
    ]

    operations = [
        migrations.AddField(
            model_name="application",
            name="phone",
            field=models.CharField(blank=True, default="", max_length=50),
        ),
        migrations.AddField(
            model_name="learner",
            name="phone",
            field=models.CharField(blank=True, default="", max_length=50),
        ),
    ]
