import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import {
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  PhotoIcon,
  ShieldCheckIcon,
  XMarkIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import '../styles/responsive.css';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  investigating: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800'
};

const priorityColors = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800'
};

function ReportDetails() {
  const { id } = useParams();
  const { userRole } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [officers, setOfficers] = useState([]);
  const [error, setError] = useState(null);
  const isAdmin = userRole === 'admin';

  useEffect(() => {
    fetchReport();
    if (isAdmin) {
      fetchOfficers();
    }
  }, [id, isAdmin]);

  const fetchReport = async () => {
    try {
      const reportRef = doc(db, 'reports', id);
      const reportSnap = await getDoc(reportRef);

      if (!reportSnap.exists()) {
        setError('Report not found');
        return;
      }

      setReport({
        id: reportSnap.id,
        ...reportSnap.data()
      });
    } catch (error) {
      console.error('Error fetching report:', error);
      setError('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const fetchOfficers = async () => {
    try {
      const officersRef = collection(db, 'officers');
      let q = query(officersRef, where('available', '==', true));
      
      if (report?.county) {
        q = query(q, where('county', '==', report.county));
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

  const handleStatusUpdate = async (newStatus) => {
    try {
      const reportRef = doc(db, 'reports', id);
      await updateDoc(reportRef, {
        status: newStatus,
        lastUpdated: new Date().toISOString()
      });
      
      setReport(prev => ({
        ...prev,
        status: newStatus,
        lastUpdated: new Date().toISOString()
      }));
      
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleAssignOfficer = async (officerId) => {
    try {
      const reportRef = doc(db, 'reports', id);
      const officerRef = doc(db, 'officers', officerId);
      const officerSnap = await getDoc(officerRef);
      
      if (!officerSnap.exists()) {
        toast.error('Selected officer not found');
        return;
      }

      const officerData = officerSnap.data();
      const updatedReport = {
        assignedOfficer: officerId,
        assignedOfficerName: officerData.name,
        assignedOfficerRank: officerData.rank,
        assignedOfficerStation: officerData.station,
        assignedAt: new Date().toISOString(),
        status: 'investigating',
        lastUpdated: new Date().toISOString()
      };

      await updateDoc(reportRef, updatedReport);

      // Update officer's assigned cases
      await updateDoc(officerRef, {
        assignedCases: [...(officerData.assignedCases || []), id]
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
              ...report,
              ...updatedReport,
              trackingId: id,
              priority: report.priority || 'Medium',
              location: `${report.location}, ${report.county}`,
              incidentType: report.title
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

      setReport(prev => ({
        ...prev,
        ...updatedReport
      }));
      
      toast.success('Officer assigned successfully');
    } catch (error) {
      console.error('Error assigning officer:', error);
      toast.error('Failed to assign officer');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">{error}</h3>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-gray-900">{report.title}</h2>
          <div className="flex space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[report.status]}`}>
              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </span>
            {report.priority && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${priorityColors[report.priority]}`}>
                {report.priority} Priority
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location Information */}
          <div className="space-y-4">
            <div className="flex items-start">
              <MapPinIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="ml-3 flex-grow">
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-base sm:text-lg text-gray-900">{report.location}</p>
                <p className="text-sm text-gray-500">{report.county} County</p>
              </div>
            </div>

            <div className="flex items-start">
              <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="ml-3 flex-grow">
                <p className="text-sm font-medium text-gray-500">Date & Time</p>
                <p className="text-base sm:text-lg text-gray-900">
                  {new Date(report.createdAt?.toDate()).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(report.createdAt?.toDate()).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Reporter Information */}
            <div className="flex items-start">
              <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="ml-3 flex-grow">
                <p className="text-sm font-medium text-gray-500">Reporter</p>
                <p className="text-base sm:text-lg text-gray-900">{report.reporterName}</p>
                {report.reporterPhone && (
                  <div className="flex items-center mt-1">
                    <PhoneIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <p className="text-sm text-gray-500">{report.reporterPhone}</p>
                  </div>
                )}
                {report.reporterEmail && (
                  <div className="flex items-center mt-1">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <p className="text-sm text-gray-500">{report.reporterEmail}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Report Details */}
          <div className="space-y-4">
            <div className="flex items-start">
              <DocumentTextIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="ml-3 flex-grow">
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-base text-gray-900 whitespace-pre-wrap">
                  {report.description}
                </p>
              </div>
            </div>

            {report.evidence && (
              <div className="flex items-start">
                <PhotoIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="ml-3 flex-grow">
                  <p className="text-sm font-medium text-gray-500">Evidence</p>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Array.isArray(report.evidence) ? (
                      report.evidence.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <img
                            src={url}
                            alt={`Evidence ${index + 1}`}
                            className="responsive-img w-full h-32 object-cover rounded-lg"
                          />
                        </a>
                      ))
                    ) : (
                      <a
                        href={report.evidence}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img
                          src={report.evidence}
                          alt="Evidence"
                          className="responsive-img w-full h-32 object-cover rounded-lg"
                        />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="mt-8 space-y-6 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Admin Controls</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Officer Assignment */}
              <div className="flex items-start">
                <UserGroupIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="ml-3 flex-grow">
                  <p className="text-sm font-medium text-gray-500">Assign Officer</p>
                  <select
                    value={report.assignedOfficer || ''}
                    onChange={(e) => handleAssignOfficer(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select an officer</option>
                    {officers.map(officer => (
                      <option key={officer.id} value={officer.id}>
                        {officer.rank} {officer.name} - {officer.station}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Update */}
              <div className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="ml-3 flex-grow">
                  <p className="text-sm font-medium text-gray-500">Update Status</p>
                  <select
                    value={report.status}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  >
                    <option value="pending">Pending</option>
                    <option value="investigating">Investigating</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Assigned Officer Details */}
            {report.assignedOfficerName && (
              <div className="flex items-start">
                <ShieldCheckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="ml-3 flex-grow">
                  <p className="text-sm font-medium text-gray-500">Assigned Officer</p>
                  <p className="text-base sm:text-lg text-gray-900">
                    {report.assignedOfficerRank} {report.assignedOfficerName}
                  </p>
                  <p className="text-sm text-gray-500">{report.assignedOfficerStation}</p>
                  {report.assignedAt && (
                    <p className="text-sm text-gray-500 mt-1">
                      Assigned on: {new Date(report.assignedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ReportDetails; 