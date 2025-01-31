import React from 'react';
import Sidebar from '../../Components/SidebarStudent'; 
import '../Pages_css/WelcomePage.css';

const WelcomePageInstructor = () => {
  return (
    <div className="welcome-page-container">
      <Sidebar />
      <div className="main-content-wp">
        <div className="welcome-header">
          <h1>Project Management System</h1>
          <p>
            Welcome to the Project Management System: Website will allow
            instructors to create and manage projects and students to upload project documents.
          </p>
        </div>
        <div className="contact-section">
          <h2>Contact Us</h2>
          <p>Email: sample@example.com</p>
          <div className="social-media-links">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePageInstructor;
