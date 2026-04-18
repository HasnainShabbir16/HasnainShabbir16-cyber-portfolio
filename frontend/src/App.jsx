import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Certifications from './pages/Certifications.jsx';
import Projects from './pages/Projects.jsx';
import Writeups from './pages/Writeups.jsx';
import WriteupDetail from './pages/WriteupDetail.jsx';
import Progress from './pages/Progress.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminLogin from './admin/AdminLogin.jsx';
import AdminLayout from './admin/AdminLayout.jsx';
import Dashboard from './admin/Dashboard.jsx';
import SettingsAdmin from './admin/SettingsAdmin.jsx';
import CategoriesAdmin from './admin/CategoriesAdmin.jsx';
import ProjectsAdmin from './admin/ProjectsAdmin.jsx';
import CertificationsAdmin from './admin/CertificationsAdmin.jsx';
import WriteupsAdmin from './admin/WriteupsAdmin.jsx';
import ProgressAdmin from './admin/ProgressAdmin.jsx';
import MessagesAdmin from './admin/MessagesAdmin.jsx';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/certifications" element={<PublicLayout><Certifications /></PublicLayout>} />
          <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
          <Route path="/writeups" element={<PublicLayout><Writeups /></PublicLayout>} />
          <Route path="/writeups/:id" element={<PublicLayout><WriteupDetail /></PublicLayout>} />
          <Route path="/progress" element={<PublicLayout><Progress /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

          {/* Admin routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<SettingsAdmin />} />
            <Route path="categories" element={<CategoriesAdmin />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="certifications" element={<CertificationsAdmin />} />
            <Route path="writeups" element={<WriteupsAdmin />} />
            <Route path="progress" element={<ProgressAdmin />} />
            <Route path="messages" element={<MessagesAdmin />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
