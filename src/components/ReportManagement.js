import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, getDocs, updateDoc, doc, getDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  UserGroupIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import '../styles/responsive.css';

function ReportManagement() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [officers, setOfficers] = useState([]);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    status: '',
    county: '',
    incidentType: '',
    searchQuery: ''
  });

  const counties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu', 'Garissa',
    'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
    'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
    'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
    'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu',
    'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka Nithi', 'Trans Nzoia', 'Turkana',
    'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
  ];

  const incidentTypes = [
    'theft', 'assault', 'fraud', 'vandalism', 'drug_related',
    'corruption', 'other'
  ];

  const statusOptions = ['pending', 'investigating', 'resolved', 'closed'];

  useEffect(() => {
    fetchReports();
    fetchOfficers();
  }, [filters]);

  const fetchOfficers = async () => {
    try {
      const officersRef = collection(db, 'officers');
      let q = query(officersRef, where('available', '==', true));
      
      if (filters.county) {
        q = query(q, where('county', '==', filters.county));
      }
      
      const querySnapshot = await getDocs(q);
      const officersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOfficers(officersList);
    } catch (error) {
      console.error('Error fetching officers:', error);
      toast.error('Failed to load officers');
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const reportsRef = collection(db, 'reports');
      
      // Start with a basic query
      let q = query(reportsRef);

      // Apply single filter at a time to avoid complex index requirements
      if (filters.status) {
        q = query(reportsRef, where('status', '==', filters.status));
      } else if (filters.county) {
        q = query(reportsRef, where('county', '==', filters.county));
      } else if (filters.incidentType) {
        q = query(reportsRef, where('title', '==', filters.incidentType));
      }

      const querySnapshot = await getDocs(q);
      let reportsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort reports by createdAt in memory
      reportsList.sort((a, b) => {
        const dateA = a.createdAt?.toDate() || new Date(0);
        const dateB = b.createdAt?.toDate() || new Date(0);
        return dateB - dateA;
      });

      // Apply remaining filters in memory
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        reportsList = reportsList.filter(report =>
          report.title?.toLowerCase().includes(searchLower) ||
          report.description?.toLowerCase().includes(searchLower) ||
          report.county?.toLowerCase().includes(searchLower)
        );
      }

      // Apply additional filters if multiple are selected
      if (filters.status && filters.county) {
        reportsList = reportsList.filter(report => 
          report.county === filters.county
        );
      }
      if (filters.status && filters.incidentType) {
        reportsList = reportsList.filter(report => 
          report.title === filters.incidentType
        );
      }
      if (filters.county && filters.incidentType) {
        reportsList = reportsList.filter(report => 
          report.title === filters.incidentType
        );
      }

      setReports(reportsList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, {
        status: newStatus,
        updatedAt: new Date()
      });
      toast.success('Status updated successfully');
      fetchReports();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleAssignOfficer = async (reportId, officerId) => {
    try {
      const reportRef = doc(db, 'reports', reportId);
      const officerRef = doc(db, 'officers', officerId);
      const officerSnap = await getDoc(officerRef);
      
      if (!officerSnap.exists()) {
        toast.error('Selected officer not found');
        return;
      }

      const officerData = officerSnap.data();
      const reportSnap = await getDoc(reportRef);
      const reportData = reportSnap.data();

      // Update report with officer assignment
      await updateDoc(reportRef, {
        assignedOfficer: officerId,
        assignedOfficerName: officerData.name,
        assignedOfficerRank: officerData.rank,
        assignedOfficerStation: officerData.station,
        assignedAt: new Date().toISOString(),
        status: 'investigating',
        lastUpdated: new Date().toISOString()
      });

      // Update officer's assigned cases
      await updateDoc(officerRef, {
        assignedCases: [...(officerData.assignedCases || []), reportId]
      });

      // Send email notification
      try {
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/email/officer-assignment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            caseDetails: {
              ...reportData,
              trackingId: reportId,
              priority: reportData.priority || 'Medium',
              location: `${reportData.location}, ${reportData.county}`,
              incidentType: reportData.title,
              description: reportData.description
            },
            officerEmail: officerData.email,
            officerDetails: {
              name: officerData.name,
              badgeNumber: officerData.badgeNumber,
              rank: officerData.rank,
              station: officerData.station
            }
          })
        });
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
      }

      toast.success('Officer assigned successfully');
      fetchReports();
      fetchOfficers();
    } catch (error) {
      console.error('Error assigning officer:', error);
      toast.error('Failed to assign officer');
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewReport = (reportId) => {
    navigate(`/admin/reports/${reportId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4 space-y-mobile">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Reports
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="Search by title, description, or county..."
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
            >
              <option value="">All Status</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              County
            </label>
            <select
              value={filters.county}
              onChange={(e) => handleFilterChange('county', e.target.value)}
              className="w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
            >
              <option value="">All Counties</option>
              {counties.map(county => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Incident Type
            </label>
            <select
              value={filters.incidentType}
              onChange={(e) => handleFilterChange('incidentType', e.target.value)}
              className="w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
            >
              <option value="">All Types</option>
              {incidentTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">No reports found matching your criteria.</p>
          </div>
        ) : (
          reports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-sm p-4-mobile cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleViewReport(report.id)}
            >
              <div className="flex flex-col md:flex-row justify-between">
                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {report.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {report.description}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewReport(report.id);
                      }}
                      className="ml-4 p-2 text-gray-400 hover:text-gray-600"
                      title="View Details"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {report.county}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      report.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : report.status === 'investigating'
                        ? 'bg-blue-100 text-blue-800'
                        : report.status === 'closed'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                    {report.priority && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.priority === 'High'
                          ? 'bg-red-100 text-red-800'
                          : report.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {report.priority} Priority
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Reported: {new Date(report.createdAt?.toDate()).toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-4 md:mt-0 md:ml-6 flex flex-col space-y-2">
                  <div className="flex flex-col space-y-2">
                    <select
                      value={report.assignedOfficer || ''}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleAssignOfficer(report.id, e.target.value);
                      }}
                      className="rounded-md text-sm font-medium border-gray-300 focus:border-red-500 focus:ring-red-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="">Assign Officer</option>
                      {officers
                        .filter(officer => officer.county === report.county)
                        .map(officer => (
                          <option key={officer.id} value={officer.id}>
                            {officer.rank} {officer.name} - {officer.station}
                          </option>
                        ))}
                    </select>

                    {report.assignedOfficerName && (
                      <div className="text-sm text-gray-600">
                        <p>Assigned to:</p>
                        <p className="font-medium">{report.assignedOfficerRank} {report.assignedOfficerName}</p>
                        <p className="text-xs">{report.assignedOfficerStation}</p>
                        <p className="text-xs">
                          {report.assignedAt && `Assigned: ${new Date(report.assignedAt).toLocaleDateString()}`}
                        </p>
                      </div>
                    )}
                  </div>

                  <select
                    value={report.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate(report.id, e.target.value);
                    }}
                    className={`rounded-md text-sm font-medium ${
                      report.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : report.status === 'investigating'
                        ? 'bg-blue-100 text-blue-800'
                        : report.status === 'closed'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReportManagement; 