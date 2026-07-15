import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

/* Common components */
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

/* Landing pages */
import Hero from './landing/Hero';
import About from './landing/About';
import Services from './landing/Services';
import Contact from './landing/Contact';
import FAQ from './landing/FAQ';
import Login from './landing/Login';
import Signup from './landing/Signup';

/* Patient dashboard */
import PatientLayout from './patients/PatientLayout';
import PatientDashboard from './patients/Dashboard';
import PatientAppointments from './patients/Appointments';
import BookAppointment from './patients/BookAppointment';
import MedicalRecords from './patients/MedicalRecords';
import Profile from './patients/Profile';

/* Admin dashboard */
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/Dashboard';
import AdminPatients from './admin/Patients';
import AdminDoctors from './admin/Doctors';
import AdminAppointments from './admin/Appointments';   // ← new import
import AdminAnalytics from './admin/Analytics';

function AppContent({ theme, toggleTheme }) {
  const location = useLocation();
  // Admin and patient dashboards have their own sidebar-based layout and
  // shouldn't show the public marketing navbar/footer — clicking Home/About
  // in there would navigate a logged-in user away from their dashboard.
  const isDashboardRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/patient');

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <div className="ambient-bg" aria-hidden="true">
        <span className="blob-1" />
        <span className="blob-2" />
        <span className="blob-3" />
      </div>
      <Toaster position="top-right" />
      {!isDashboardRoute && <Navbar theme={theme} toggleTheme={toggleTheme} />}
      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Hero />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Patient routes – protected */}
          <Route
            path="/patient"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PatientDashboard />} />
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="appointments" element={<PatientAppointments />} />
            <Route path="book" element={<BookAppointment />} />
            <Route path="records" element={<MedicalRecords />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin routes – protected */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="patients" element={<AdminPatients />} />
            <Route path="doctors" element={<AdminDoctors />} />
            <Route path="appointments" element={<AdminAppointments />} />   {/* ← new route */}
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>
        </Routes>
      </main>
      {!isDashboardRoute && <Footer />}
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent theme={theme} toggleTheme={toggleTheme} />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
