// This page is similar page of the StudentDashboard (Shows project Details to instructor). 
// So it uses same css file. 
// But uses Instructer Sidebar
/*
const fetchProjectDetails = async () => {
    try {
        const response = await fetch(`http://localhost:8000/api/projects/${projectId}/`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Project Details Fetched:', data); // Debug
            setProjectDetails(data);
        } else {
            const errorText = await response.text();
            console.error('Error Fetching Project:', errorText);
            alert(errorText || 'Failed to fetch project details.');
        }
    } catch (error) {
        console.error('Network Error:', error);
        alert('An error occurred while fetching project details.');
    }
};
*/
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../Components/SidebarInstructor';
import '../Pages_css/StudentDashboard.css';

const ProjectDetails = () => {
  const { projectId } = useParams();
  console.log('Project ID:', projectId);
  const [projectDetails, setProjectDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/projects/${projectId}/`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        
  
        if (response.ok) {
          const data = await response.json();
          console.log('Project Details:', data); // Debugging
          setProjectDetails(data);
        } else if (response.status === 404) {
          alert('Project not found.');
          navigate('/instructor/myProjects'); // Redirect to the dashboard
        } else if (response.status === 403) {
          alert('You are not authorized to view this project.');
          navigate('/instructor/myProjects'); // Redirect to the dashboard
        } else {
          alert('Failed to fetch project details.');
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
        alert('An error occurred while fetching project details.');
      }
    };
  
    fetchProjectDetails();
  }, [projectId, navigate]);

  if (!projectDetails) {
    return <p>Loading or no data found...</p>;
  }

  return (
    <div className="student-dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="project-header">
          <h1>Project Details</h1>
        </div>

        <div className="details-container-name">
          <div className="project-info">
            <p><strong>Project Name:</strong> {projectDetails.name}</p>
            <p><strong>Description:</strong> {projectDetails.description}</p>
            <p><strong>Instructor:</strong> {projectDetails.instructor}</p>
          </div>
        </div>

        <div className="details-container">
          <div className="list">
            <h3>Student List</h3>
            <ul>
              {Array.isArray(projectDetails.students) && projectDetails.students.length > 0 ? (
                projectDetails.students.map((student) => (
                  <li key={student.id}>{student.username}</li>
                ))
              ) : (
                <li>No students assigned</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;

