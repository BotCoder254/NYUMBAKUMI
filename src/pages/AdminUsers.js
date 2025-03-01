import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';
import {
  UserCircleIcon,
  ShieldCheckIcon,
  NoSymbolIcon,
  TrashIcon,
  CheckCircleIcon,
  XMarkIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all'
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));

      if (filters.role !== 'all') {
        q = query(q, where('role', '==', filters.role));
      }
      if (filters.status !== 'all') {
        q = query(q, where('status', '==', filters.status));
      }

      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        status: newStatus,
        lastUpdated: new Date().toISOString()
      });
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'users', userId));
      toast.success('User deleted successfully');
      fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'citizen':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <UserCircleIcon className="h-8 w-8 text-red-600 mr-3" />
                User Management
              </h2>
              <p className="mt-2 text-gray-600">
                Manage user accounts and permissions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  className="border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="citizen">Citizen</option>
                </select>
              </div>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No users found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            <AnimatePresence>
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-6 hover:bg-gray-50 transition duration-150"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-gray-900">{user.email}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Created: {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleStatusUpdate(user.id, 'suspended')}
                          className="flex items-center text-yellow-600 hover:text-yellow-700"
                        >
                          <NoSymbolIcon className="h-5 w-5 mr-1" />
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusUpdate(user.id, 'active')}
                          className="flex items-center text-green-600 hover:text-green-700"
                        >
                          <CheckCircleIcon className="h-5 w-5 mr-1" />
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="flex items-center text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers; 