from django.urls import path
from .views import RegisterView, LoginView, MeView, StudentListView, StudentProjectsView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', MeView.as_view(), name='me'),
    path('students/', StudentListView.as_view(), name='student-list'),
    path('my-projects/', StudentProjectsView.as_view(), name='student-projects'),


]
