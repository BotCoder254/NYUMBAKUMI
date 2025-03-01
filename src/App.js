import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReportCrime from './pages/ReportCrime';
import AnonymousReport from './pages/AnonymousReport';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import TrackReport from './pages/TrackReport';
import ResetPassword from './pages/ResetPassword';
import Feedback from './pages/Feedback';
import Footer from './components/Footer';
import CrimeFeed from './components/CrimeFeed';
import SearchPage from './pages/SearchPage';
import Resources from './pages/Resources';
import SafetyGuidelines from './pages/safety/SafetyGuidelines';
import BlogManagement from './components/BlogManagement';
import BlogSection from './components/BlogSection';
import BlogPost from './components/BlogPost';
import BlogSearch from './components/BlogSearch';
import BlogAnalytics from './components/BlogAnalytics';
import ReportManagement from './components/ReportManagement';
import OfficerManagement from './components/OfficerManagement';
import CaseAssignment from './components/CaseAssignment';
import AdminAnalytics from './components/AdminAnalytics';
import UserManagement from './components/UserManagement';
import AdminReportDetails from './components/AdminReportDetails';
import FeedbackAnalytics from './components/FeedbackAnalytics';
import ReportDetails from './components/ReportDetails';

function AppContent() {
  const { currentUser } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Toaster position="top-center" />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={currentUser ? <Navigate to="/dashboard" /> : <Home />}
        />
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={currentUser ? <Navigate to="/dashboard" /> : <Register />}
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/track-report" element={<TrackReport />} />
        <Route path="/anonymous-report" element={<AnonymousReport />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/safety/guidelines" element={<SafetyGuidelines />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/blog/search" element={<BlogSearch />} />

        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/report-crime"
          element={
            <PrivateRoute>
              <ReportCrime />
            </PrivateRoute>
          }
        />
        <Route
          path="/feed"
          element={
            <PrivateRoute>
              <CrimeFeed />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports/:id"
          element={
            <PrivateRoute>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ReportDetails />
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/report-details/:id"
          element={
            <PrivateRoute>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ReportDetails />
              </div>
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AdminUsers />
              </div>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users-management"
          element={
            <AdminRoute>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <UserManagement />
              </div>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ReportManagement />
              </div>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports/:id"
          element={
            <AdminRoute>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ReportDetails isAdminView={true} />
              </div>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/report-details/:id"
          element={
            <AdminRoute>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ReportDetails isAdminView={true} />
              </div>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/officers"
          element={
            <AdminRoute>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <OfficerManagement />
              </div>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/cases"
          element={
            <AdminRoute>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <CaseAssignment />
              </div>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <AdminRoute>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AdminAnalytics />
              </div>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/blog"
          element={
            <AdminRoute>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <BlogAnalytics />
                <div className="mt-8">
                  <BlogManagement />
                </div>
              </div>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/feedback"
          element={
            <AdminRoute>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <FeedbackAnalytics />
              </div>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/resources"
          element={
            <AdminRoute>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Resources />
              </div>
            </AdminRoute>
          }
        />
      </Routes>
      {!currentUser && location.pathname === '/' && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
