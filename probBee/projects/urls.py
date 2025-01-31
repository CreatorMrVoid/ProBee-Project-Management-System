from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, DocumentViewSet, DocumentUploadView

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'documents', DocumentViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Includes all CRUD routes for `ProjectViewSet`
    path('upload/', DocumentUploadView.as_view(), name='document-upload'),
    path('all/', ProjectViewSet.as_view({'get': 'list'}), name='all-projects'),
    
]
