from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import CustomUser
from .serializers import UserSerializer, LoginSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(username=username, password=password)
            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_200_OK)
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Return authenticated user details
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
   
class StudentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Ensure the user is an instructor
        if request.user.role != 'Instructor':
            return Response({"error": "Only instructors can fetch the student list."}, status=status.HTTP_403_FORBIDDEN)

        # Fetch students and serialize
        students = CustomUser.objects.filter(role='Student')
        serializer = UserSerializer(students, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class StudentProjectsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'Student':
            return Response({"error": "Only students can access this endpoint."}, status=403)

        # Fetch projects assigned to the logged-in student
        projects = request.user.assigned_projects.all()  # Many-to-Many relationship
        if not projects.exists():
            return Response({"message": "No projects assigned to you."}, status=404)

        data = [
            {
                "id": project.id,
                "name": project.name,
                "description": project.description,
                "instructor": project.instructor.username,
                "students": [student.username for student in project.students.all()],
                "documents": [{"id": doc.id, "file": doc.file.url} for doc in project.documents.all()]
            }
            for project in projects
        ]
        return Response(data, status=200)
