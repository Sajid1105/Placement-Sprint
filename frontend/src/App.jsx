import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Timeline from './pages/Timeline';
import Resources from './pages/Resources';
import DsaTracker from './pages/DsaTracker';
import StudySession from './pages/StudySession';
import Notes from './pages/Notes';
import Applications from './pages/Applications';
import Profile from './pages/Profile';
import Readiness from './pages/Readiness';
import LoadingScreen from './components/LoadingScreen';

export default function App() {
  const { loading } = useAuth();
  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="timeline" element={<Timeline />} />
        <Route path="resources" element={<Resources />} />
        <Route path="dsa" element={<DsaTracker />} />
        <Route path="session" element={<StudySession />} />
        <Route path="notes" element={<Notes />} />
        <Route path="applications" element={<Applications />} />
        <Route path="readiness" element={<Readiness />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
