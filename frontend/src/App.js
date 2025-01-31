import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/Page_js/LoginPage';
import InstructorDashboard from './Pages/Page_js/InstructorDashborad';
import StudentDashboard from './Pages/Page_js/StudentDashboard';
import NewProject from './Pages/Page_js/NewProject'
import ProjectDetails from './Pages/Page_js/ProjectDetails';
import WelcomePageStudent from './Pages/Page_js/WelcomePageStudent';
import WelcomePageInstructor from './Pages/Page_js/WelcomePageInstructor';
import RegisterPage from './Pages/Page_js/RegisterPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/instructor/myProjects" element={<InstructorDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/instructor" element={<InstructorDashboard />} />  {/* Currently not used  */}
        <Route path="/instructor/newProject" element={<NewProject />} />
        <Route path="/instructor/myProjects/:projectId" element={<ProjectDetails />} />
        <Route path="/instructor/home" element={<WelcomePageInstructor />} />
        <Route path="/instructor/home" element={<WelcomePageInstructor />} />
        <Route path="/student/home" element={<WelcomePageStudent />} />
        <Route path="/student/myProjects" element={<StudentDashboard />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
