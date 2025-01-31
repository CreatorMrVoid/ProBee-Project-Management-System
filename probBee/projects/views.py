from rest_framework import viewsets, permissions

from users.models import CustomUser
from .models import Project, Document
from .serializers import ProjectSerializer, DocumentSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

class ProjectViewSet(viewsets.ModelViewSet): 
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()  # Add this line
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            data = request.data
            instructor = request.user

            if instructor.role != 'Instructor':
                return Response({"error": "Only instructors can create projects."}, status=status.HTTP_403_FORBIDDEN)

            # Ensure students are provided
            student_ids = data.get('students', [])
            if not student_ids:
                return Response({"error": "At least one student must be assigned."}, status=status.HTTP_400_BAD_REQUEST)

            # Validate students
            students = CustomUser.objects.filter(id__in=student_ids, role='Student')
            if not students.exists():
                return Response({"error": "Invalid student IDs."}, status=400)

            # Create the project
            project = Project.objects.create(
                name=data['name'],
                description=data['description'],
                instructor=instructor
            )
            project.students.set(students)  # Assign students to the project
            project.save()

            return Response(self.serializer_class(project).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print("Error creating project:", str(e))
            return Response({"error": "An internal error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def retrieve(self, request, *args, **kwargs):
        try:
            project_id = kwargs.get('pk')
            print(f"Retrieve called with project ID: {project_id}")
            project = self.get_object()
            print(f"Project retrieved: {project}")

            # Ensure proper permissions
            if request.user.role == 'Instructor' and request.user != project.instructor:
                print(f"Unauthorized access by: {request.user}")
                return Response({"error": "You are not authorized to access this project."}, status=403)

            # Serialize project data
            project_data = self.get_serializer(project).data
            project_data['students'] = [
                {"id": student.id, "username": student.username}
                for student in project.students.all()
            ]
            return Response(project_data, status=200)
        except Project.DoesNotExist:
            print(f"Project with ID {kwargs.get('pk')} does not exist.")
            return Response({"error": "Project not found."}, status=404)


    def list(self, request, *args, **kwargs):
        # Allow only instructors to access this
        if request.user.role != 'Instructor':
            return Response({"error": "Only instructors can access this resource."}, status=403)

        # Fetch projects created by this instructor
        projects = Project.objects.filter(instructor=request.user)
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data, status=200)



class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    queryset = Document.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

class DocumentUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        project_id = request.data.get('project')
        file = request.FILES.get('file')

        if not project_id or not file:
            return Response({"error": "Project ID and file are required."}, status=400)

        try:
            project = Project.objects.get(id=project_id)

            # Ensure the user is assigned to the project
            if request.user not in project.students.all():
                return Response({"error": "You are not assigned to this project."}, status=403)

            # Save the uploaded document
            document = Document.objects.create(
                project=project,
                uploaded_by=request.user,
                file=file,
            )
            serializer = DocumentSerializer(document)
            return Response(serializer.data, status=201)
        except Project.DoesNotExist:
            return Response({"error": "Project not found."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)