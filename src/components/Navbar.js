import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  ShieldExclamationIcon,
  HomeIcon,
  UserCircleIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  UserGroupIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  NewspaperIcon,
  ChatBubbleBottomCenterTextIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  AdjustmentsHorizontalIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  UsersIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { ROLE_HIERARCHY, ROLE_PERMISSIONS } from './AdminRoute';

function Navbar() {
  const { currentUser, logout, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const role = userDoc.data()?.role;
        setLoading(false);
      } catch (error) {
        console.error('Error checking permissions:', error);
        setLoading(false);
      }
    };

    checkPermissions();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsSidebarOpen(false);
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const isAdmin = userRole === 'admin';
  const isCitizen = userRole === 'citizen';

  return (
    <>
      {/* Fixed Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100">
                <Bars3Icon className="h-6 w-6 text-gray-600" />
              </button>
              <Link to="/" className="flex items-center ml-4" onClick={closeSidebar}>
                <ShieldExclamationIcon className="h-8 w-8 text-red-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  Crime Report Kenya
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-30 overflow-y-auto`}
        style={{ top: '64px' }}
      >
        <div className="py-4">
          <div className="px-4 space-y-2">
            <Link 
              to="/" 
              className="flex items-center text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
              onClick={closeSidebar}
            >
              <HomeIcon className="h-5 w-5 mr-3" />
              Home
            </Link>

            <Link 
              to="/resources" 
              className="flex items-center text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
              onClick={closeSidebar}
            >
              <BookOpenIcon className="h-5 w-5 mr-3" />
              Resources
            </Link>

            {(!currentUser || (currentUser && !isAdmin)) && (
              <>
                <Link 
                  to="/track-report" 
                  className="flex items-center text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
                  onClick={closeSidebar}
                >
                  <ClipboardDocumentListIcon className="h-5 w-5 mr-3" />
                  Track Report
                </Link>

                <Link 
                  to="/search" 
                  className="flex items-center text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
                  onClick={closeSidebar}
                >
                  <MagnifyingGlassIcon className="h-5 w-5 mr-3" />
                  Search Reports
                </Link>

                <Link 
                  to="/blog/search" 
                  className="flex items-center text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
                  onClick={closeSidebar}
                >
                  <MagnifyingGlassIcon className="h-5 w-5 mr-3" />
                  Blog Search
                </Link>
              </>
            )}

            {currentUser && (
              <>
                {isCitizen && (
                  <>
                    <div className="border-t border-gray-200 my-4"></div>
                    <Link 
                      to="/dashboard" 
                      className="flex items-center text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
                      onClick={closeSidebar}
                    >
                      <UserCircleIcon className="h-5 w-5 mr-3" />
                      Dashboard
                    </Link>

                    <Link 
                      to="/report-crime" 
                      className="flex items-center text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
                      onClick={closeSidebar}
                    >
                      <DocumentTextIcon className="h-5 w-5 mr-3" />
                      Report Crime
                    </Link>

                    <Link 
                      to="/feed" 
                      className="flex items-center text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
                      onClick={closeSidebar}
                    >
                      <NewspaperIcon className="h-5 w-5 mr-3" />
                      Crime Feed
                    </Link>

                    <Link 
                      to="/feedback" 
                      className="flex items-center text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
                      onClick={closeSidebar}
                    >
                      <ChatBubbleBottomCenterTextIcon className="h-5 w-5 mr-3" />
                      Feedback
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <>
                    <div className="border-t border-gray-200 my-4"></div>
                    <Link 
                      to="/admin" 
                      className="flex items-center text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
                      onClick={closeSidebar}
                    >
                      <ChartBarIcon className="h-5 w-5 mr-3" />
                      Dashboard
                    </Link>

                    <Link 
                      to="/admin/reports" 
                      className="flex items-center text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
                      onClick={closeSidebar}
                    >
                      <ClipboardDocumentListIcon className="h-5 w-5 mr-3" />
                      Reports
                    </Link>

                    <Link 
                      to="/admin/reports/details" 
                      className="flex items-center text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
                      onClick={closeSidebar}
                    >
                      <DocumentTextIcon className="h-5 w-5 mr-3" />
                      Report Details
                    </Link>

                    <Link 
                      to="/admin/users-management" 
                      className="flex items-center text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
                      onClick={closeSidebar}
                    >
                      <UsersIcon className="h-5 w-5 mr-3" />
                      Users Management
                    </Link>

                    <Link 
                      to="/admin/users" 
                      className="flex items-center text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
                      onClick={closeSidebar}
                    >
                      <UsersIcon className="h-5 w-5 mr-3" />
                      Users
                    </Link>

                    <Link 
                      to="/admin/officers" 
                      className="flex items-center text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
                      onClick={closeSidebar}
                    >
                      <ShieldCheckIcon className="h-5 w-5 mr-3" />
                      Officers
                    </Link>

                    <Link 
                      to="/admin/cases" 
                      className="flex items-center text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
                      onClick={closeSidebar}
                    >
                      <DocumentTextIcon className="h-5 w-5 mr-3" />
                      Cases
                    </Link>

                    <Link 
                      to="/admin/analytics" 
                      className="flex items-center text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
                      onClick={closeSidebar}
                    >
                      <ChartBarIcon className="h-5 w-5 mr-3" />
                      Analytics
                    </Link>

                    <Link 
                      to="/admin/blog" 
                      className="flex items-center text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
                      onClick={closeSidebar}
                    >
                      <NewspaperIcon className="h-5 w-5 mr-3" />
                      Blog
                    </Link>

                    <Link 
                      to="/admin/feedback" 
                      className="flex items-center text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
                      onClick={closeSidebar}
                    >
                      <ChatBubbleBottomCenterTextIcon className="h-5 w-5 mr-3" />
                      Feedback
                    </Link>

                    <Link 
                      to="/admin/resources" 
                      className="flex items-center text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
                      onClick={closeSidebar}
                    >
                      <BookOpenIcon className="h-5 w-5 mr-3" />
                      Resources
                    </Link>
                  </>
                )}
              </>
            )}

            {!currentUser && (
              <>
                <div className="border-t border-gray-200 my-4"></div>
                <Link 
                  to="/anonymous-report" 
                  className="flex items-center text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
                  onClick={closeSidebar}
                >
                  <EyeSlashIcon className="h-5 w-5 mr-3" />
                  Anonymous Report
                </Link>
                <Link 
                  to="/login" 
                  className="flex items-center text-gray-700 hover:text-red-600 transition duration-300 p-2 rounded-lg hover:bg-gray-100"
                  onClick={closeSidebar}
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="flex items-center bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition duration-300 mt-2"
                  onClick={closeSidebar}
                >
                  <UserCircleIcon className="h-5 w-5 mr-3" />
                  Sign Up
                </Link>
              </>
            )}

            {currentUser && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition duration-300 w-full mt-4"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                Sign Out
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Main Content Spacing */}
      <div className="pt-16">
        {/* Your page content goes here */}
      </div>
    </>
  );
}

export default Navbar;