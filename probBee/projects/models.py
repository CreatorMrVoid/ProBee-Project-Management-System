from django.db import models
from users.models import CustomUser

class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    instructor = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='projects', limit_choices_to={'role': 'Instructor'})
    students = models.ManyToManyField(CustomUser, related_name='assigned_projects', limit_choices_to={'role': 'Student'})

class Document(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='documents')
    uploaded_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    file = models.FileField(upload_to='documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
