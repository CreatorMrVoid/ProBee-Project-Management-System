// MyProjects page


import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/SidebarInstructor';
import '../Pages_css/InstructorDashboard.css';
import { useNavigate } from 'react-router-dom';

const InstructorDashboard = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/projects/all/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log('Project Details:', data);
          setProjects(data);
        } else {
          console.error('API Response Status:', response.status);
          console.error('API Response Text:', await response.text());
          if (response.status === 404) {
            alert('Project not found.');
            navigate('/instructor/myProjects');
          } else if (response.status === 403) {
            alert('You are not authorized to view this project.');
            navigate('/instructor/myProjects');
          } else {
            alert('Failed to fetch project details.');
          }
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
        alert('An error occurred while fetching project details.');
      }
    };
    
  
    fetchProjects();
  }, [navigate]);
  
  

  const handleDetailClick = (projectId) => {
    console.log('Project ID:', projectId);
    navigate(`/instructor/myProjects/${projectId}`);
  };
  

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="content">
        <h1>My Projects</h1>
        <table>
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Project Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(projects) && projects.length > 0 ? (
              projects.map((project) => (             
                <tr key={project.id}>
                <td>{project.id}</td>
                <td>{project.name}</td>
                <td>
                  <button className="detail-button" onClick={() => handleDetailClick(project.id)}>
                    Detail
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No projects available.</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstructorDashboard;
