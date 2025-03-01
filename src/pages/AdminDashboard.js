import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  startAfter,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import AdminReportDetails from '../components/AdminReportDetails';
import AdminAnalytics from '../components/AdminAnalytics';
import {
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  TableCellsIcon,
  PresentationChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChatBubbleBottomCenterTextIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import FeedbackAnalytics from '../components/FeedbackAnalytics';
import OfficerManagement from '../components/OfficerManagement';
import CaseAssignment from '../components/CaseAssignment';
import Analytics from '../components/Analytics';
import ReportManagement from '../components/ReportManagement';
import UserManagement from '../components/UserManagement';

function AdminDashboard() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0
  });

  // Filtering states
  const [filters, setFilters] = useState({
    status: '',
    county: '',
    incidentType: '',
    dateRange: {
      start: '',
      end: ''
    },
    searchQuery: '',
    severity: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  const statusOptions = ['pending', 'in progress', 'resolved', 'rejected', 'urgent'];
  const severityOptions = ['low', 'medium', 'high', 'critical'];
  const incidentTypes = [
    'theft', 'assault', 'fraud', 'vandalism', 'drug_related',
    'corruption', 'other'
  ];

  const counties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu', 'Garissa',
    'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
    'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
    'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
    'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu',
    'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka Nithi', 'Trans Nzoia', 'Turkana',
    'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
  ];

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      let q = query(collection(db, 'reports'));

      // Apply filters
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters.county) {
        q = query(q, where('county', '==', filters.county));
      }
      if (filters.incidentType) {
        q = query(q, where('incidentType', '==', filters.incidentType));
      }
      if (filters.severity) {
        q = query(q, where('severity', '==', filters.severity));
      }
      if (filters.dateRange.start) {
        const startDate = new Date(filters.dateRange.start);
        q = query(q, where('timestamp', '>=', startDate.toISOString()));
      }
      if (filters.dateRange.end) {
        const endDate = new Date(filters.dateRange.end);
        q = query(q, where('timestamp', '<=', endDate.toISOString()));
      }

      const querySnapshot = await getDocs(q);
      const reportData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Apply search filter on client side
      let filteredReports = reportData;
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        filteredReports = reportData.filter(report =>
          report.description?.toLowerCase().includes(searchLower) ||
          report.location?.toLowerCase().includes(searchLower) ||
          report.county?.toLowerCase().includes(searchLower)
        );
      }

      setReports(filteredReports);

      // Update statistics
      const newStats = {
        total: filteredReports.length,
        pending: filteredReports.filter(r => r.status === 'pending').length,
        inProgress: filteredReports.filter(r => r.status === 'in progress').length,
        resolved: filteredReports.filter(r => r.status === 'resolved').length,
        rejected: filteredReports.filter(r => r.status === 'rejected').length
      };
      setStats(newStats);

    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, {
        status: newStatus,
        lastUpdated: new Date().toISOString()
      });

      // Update local state
      setReports(prevReports =>
        prevReports.map(report =>
          report.id === reportId
            ? { ...report, status: newStatus, lastUpdated: new Date().toISOString() }
            : report
        )
      );

      toast.success('Status updated successfully');
      fetchReports(); // Refresh stats
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'high':
        return 'bg-orange-50 border-orange-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const tabs = [
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
    { id: 'reports', name: 'Reports', icon: DocumentTextIcon },
    { id: 'users', name: 'Users', icon: UserGroupIcon },
    { id: 'officers', name: 'Officers', icon: UserGroupIcon },
    { id: 'case-assignment', name: 'Case Assignment', icon: ClipboardDocumentCheckIcon },
    { id: 'feedback', name: 'Feedback', icon: ChatBubbleBottomCenterTextIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow rounded-lg"
        >
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 px-4 py-4 text-center border-b-2
                    ${
                      activeTab === tab.id
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                    transition-colors duration-200
                  `}
                >
                  <tab.icon
                    className={`h-5 w-5 mx-auto mb-1 ${
                      activeTab === tab.id ? 'text-red-600' : 'text-gray-400'
                    }`}
                  />
                  <span className="text-sm font-medium">{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <main className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {activeTab === 'analytics' && <Analytics />}
              {activeTab === 'reports' && <ReportManagement />}
              {activeTab === 'users' && <UserManagement />}
              {activeTab === 'officers' && <OfficerManagement />}
              {activeTab === 'case-assignment' && <CaseAssignment />}
              {activeTab === 'feedback' && <FeedbackAnalytics />}
            </div>
          </main>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminDashboard; 