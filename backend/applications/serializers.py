from rest_framework import serializers

from .models import Application, Learner


class IsoDateField(serializers.DateField):
    def to_internal_value(self, value):
        if isinstance(value, str) and "T" in value:
            value = value.split("T", 1)[0]
        return super().to_internal_value(value)


class ApplicationSerializer(serializers.ModelSerializer):
    dob = IsoDateField()

    class Meta:
        model = Application
        fields = "__all__"
        read_only_fields = ["id", "created_at"]


class LearnerSerializer(serializers.ModelSerializer):
    dob = IsoDateField()

    class Meta:
        model = Learner
        fields = "__all__"
        read_only_fields = ["id", "created_at"]
