import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPinIcon, ClockIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

function CrimeFeed() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simplified query that doesn't require composite index
    const q = query(
      collection(db, 'reports'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newReports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      // Filter public reports in memory instead
      .filter(report => report.isPublic === true);
      
      setReports(newReports);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching reports:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getIncidentColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'theft':
        return 'text-red-600';
      case 'assault':
        return 'text-orange-600';
      case 'fraud':
        return 'text-yellow-600';
      case 'vandalism':
        return 'text-blue-600';
      case 'drug_related':
        return 'text-purple-600';
      case 'corruption':
        return 'text-indigo-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <ShieldExclamationIcon className="h-8 w-8 text-red-600 mr-3" />
            Real-Time Crime Feed
          </h2>
          <p className="mt-2 text-gray-600">
            Latest reported incidents in your area. Stay informed and stay safe.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No public reports available.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            <AnimatePresence>
              {reports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-6 hover:bg-gray-50 transition duration-150"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className={`font-semibold ${getIncidentColor(report.incidentType)}`}>
                          {report.incidentType?.charAt(0).toUpperCase() + 
                           report.incidentType?.slice(1).replace('_', ' ')}
                        </span>
                        {report.severity === 'critical' && (
                          <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                            Critical
                          </span>
                        )}
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {report.county}, {report.location}
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {formatTimestamp(report.timestamp)}
                      </div>

                      <p className="text-gray-700 mt-2">{report.description}</p>
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

export default CrimeFeed; 