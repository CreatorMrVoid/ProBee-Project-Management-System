import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SidebarInstructor.css'

const SidebarInstructor = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <img src="logo.png" alt="Logo" className="logo" />
      <button onClick={() => navigate('/instructor/home')} className="sidebar-button">Home Page</button>
      <button onClick={() => navigate('/instructor/newProject')} className="sidebar-button">New Project</button>
      <button onClick={() => navigate('/instructor/myProjects')} className="sidebar-button">My Projects</button>
    </div>
  );
};

export default SidebarInstructor;
