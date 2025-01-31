import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Pages_css/NewProject.css';
import Sidebar from '../../Components/SidebarInstructor';

const NewProject = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/users/students/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        } else if (response.status === 401) {
          alert('Unauthorized. Please log in again.');
          navigate('/login');
        } else {
          alert('Failed to fetch students.');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
  
    fetchStudents();
  }, [navigate]);
  

  const handleStudentSelection = (event) => {
    const selectedStudentId = parseInt(event.target.value); // Ensure the ID is a number
    if (event.target.checked) {
      // Add the student to selected list
      setSelectedStudents((prev) => [...prev, selectedStudentId]);
    } else {
      // Remove the student from selected list
      setSelectedStudents((prev) => prev.filter((id) => id !== selectedStudentId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/projects/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          name: projectName,
          description,
          students: selectedStudents,
        }),
      });

      if (response.ok) {
        alert('Project created successfully!');
        navigate('/instructor/myProjects');
      } else {
        const errorData = await response.json();
        alert(`Error creating project: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('An error occurred while creating the project.');
    }
  };

  return (
    <div className="new-project-container">
      <Sidebar />
      <div className="content">
        <h1>Create New Project</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Project Name:
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Description:
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Students:
              <div className="student-list">
                {students.map((student) => (
                  <div key={student.id} className="student-checkbox">
                    <input
                      type="checkbox"
                      value={student.id}
                      onChange={handleStudentSelection} // Use handleStudentSelection here
                    />
                    <label>{student.username}</label>
                  </div>
                ))}
              </div>
            </label>
          </div>
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
};

export default NewProject;
