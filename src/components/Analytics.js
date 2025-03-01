import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState({
    totalReports: 0,
    totalUsers: 0,
    reportsPerCategory: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch reports data
        const reportsRef = collection(db, 'reports');
        const reportsQuery = query(reportsRef, orderBy('timestamp', 'desc'));
        const reportsSnapshot = await getDocs(reportsQuery);

        // Fetch users data
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);

        // Process reports data
        const categories = {};
        const recentActivity = [];
        
        reportsSnapshot.forEach((doc) => {
          const report = doc.data();
          // Update categories count
          categories[report.incidentType] = (categories[report.incidentType] || 0) + 1;
          
          // Add to recent activity
          if (recentActivity.length < 5) {
            recentActivity.push({
              id: doc.id,
              type: report.incidentType,
              timestamp: report.timestamp,
              status: report.status
            });
          }
        });

        // Convert categories to chart data
        const reportsPerCategory = Object.entries(categories).map(([name, value]) => ({
          name,
          value
        }));

        setAnalyticsData({
          totalReports: reportsSnapshot.size,
          totalUsers: usersSnapshot.size,
          reportsPerCategory,
          recentActivity
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalReports}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.reportsPerCategory.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <ShieldExclamationIcon className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Cases</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.recentActivity.filter(a => a.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports by Category Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports by Category</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData.reportsPerCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {analyticsData.recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div>
                <p className="font-medium text-gray-900">{activity.type}</p>
                <p className="text-sm text-gray-500">
                  {new Date(activity.timestamp?.seconds * 1000).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                  activity.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default Analytics; 