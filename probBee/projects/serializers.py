from rest_framework import serializers
from .models import Project, Document
from users.models import CustomUser

class ProjectSerializer(serializers.ModelSerializer):
    instructor = serializers.StringRelatedField(read_only=True)
    students = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.filter(role='Student'), many=True)


    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'instructor', 'students']

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'project', 'uploaded_by', 'file', 'uploaded_at']
