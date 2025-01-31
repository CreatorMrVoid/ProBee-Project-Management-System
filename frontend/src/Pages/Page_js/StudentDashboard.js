import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/SidebarStudent';
import '../Pages_css/StudentDashboard.css';

const StudentDashboard = () => {
  const [projectDetails, setProjectDetails] = useState({
    name: '',
    description: '',
    students: [],
    documents: [],
  });

  const handleFileUpload = async (event) => {
    if (!projectDetails || !projectDetails.id) {
      alert('No project found. Please create a project first.');
      return;
    }
  
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project', projectDetails.id); // Dynamically use the project ID
  
    try {
      const response = await fetch('http://localhost:8000/api/projects/upload/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        setProjectDetails((prevDetails) => ({
          ...prevDetails,
          documents: [...prevDetails.documents, data.file], // Add uploaded file to the state
        }));
        alert('File uploaded successfully.');
      } else {
        const errorData = await response.json();
        alert(`Failed to upload file: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred while uploading the file.');
    }
  };
  
  
  useEffect(() => {
    const fetchAssignedProjects = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/users/my-projects/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
    
        if (response.ok) {
          const projects = await response.json();
          if (projects.length > 0) {
            const project = projects[0]; // Assuming one project per student
            setProjectDetails({
              id: project.id,
              name: project.name,
              description: project.description,
              students: project.students,
              documents: project.documents.map((doc) => doc.file),
            });
          } else {
            alert('No projects assigned to you.');
          }
        } else if (response.status === 403) {
          alert('You are not authorized to view this resource.');
        } else {
          alert('Failed to fetch project details.');
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
        alert('An error occurred while fetching project details.');
      }
    };
    
  
    fetchAssignedProjects();
  }, []);
  
  
  

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
          </div>
        </div>
  

        <div className="details-container">
          
          <div className="lists-container">
            <div className="list">
              <h3>Student List</h3>
              <ul>
                {projectDetails.students?.map((student, index) => (
                  <li key={index}>{student}</li>
                )) || <li>No students assigned.</li>}
              </ul>
            </div>
            <div className="list">
              <h3>File List</h3>
              <ul>
              {projectDetails.documents?.map((doc, index) => (
                <li key={index}><a href={doc} target="_blank" rel="noopener noreferrer">Download Document {index + 1}</a></li>
              )) || <li>No documents available.</li>}
              </ul>
            </div>
          </div>
        </div>

        <div className="upload-section">
          <h2>Upload Project Documents</h2>
          <input type="file" onChange={handleFileUpload} />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
