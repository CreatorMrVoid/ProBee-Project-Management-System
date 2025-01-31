import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Components/SidebarStudent.css'

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <img src="logo.png" alt="Logo" className="logo" />
      <button onClick={() => navigate('/student/home')} className="sidebar-button">Home Page</button>
      <button onClick={() => navigate('/student/myProjects')} className="sidebar-button">My Projects</button>
    </div>
  );
};

export default Sidebar;
