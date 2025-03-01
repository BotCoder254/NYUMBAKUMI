import { useState } from 'react';
import { motion } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  CheckCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  DocumentMagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

function TrackReport() {
  const [trackingId, setTrackingId] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const stages = [
    { id: 'received', label: 'Received', icon: ClockIcon },
    { id: 'in_review', label: 'In Review', icon: DocumentMagnifyingGlassIcon },
    { id: 'investigating', label: 'Investigating', icon: MagnifyingGlassIcon },
    { id: 'resolved', label: 'Resolved', icon: CheckCircleIcon },
  ];

  const getStageIndex = (status) => {
    switch (status) {
      case 'received':
        return 0;
      case 'in_review':
        return 1;
      case 'investigating':
        return 2;
      case 'resolved':
        return 3;
      default:
        return 0;
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    setError(null);
    setReport(null);

    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    setLoading(true);
    try {
      const reportDoc = await getDoc(doc(db, 'reports', trackingId));
      if (!reportDoc.exists()) {
        setError('Report not found. Please check the tracking ID.');
        return;
      }
      setReport(reportDoc.data());
    } catch (error) {
      setError('Error fetching report. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Track Your Report</h2>

        <form onSubmit={handleTrack} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter your tracking ID"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-300 disabled:opacity-50"
            >
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </form>

        {report && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="relative">
              <div className="flex items-center justify-between w-full">
                {stages.map((stage, index) => {
                  const StageIcon = stage.icon;
                  const currentStageIndex = getStageIndex(report.status);
                  const isCompleted = index <= currentStageIndex;
                  const isCurrent = index === currentStageIndex;

                  return (
                    <div
                      key={stage.id}
                      className="flex flex-col items-center relative z-10"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-400'
                        } ${
                          isCurrent ? 'ring-2 ring-green-600' : ''
                        }`}
                      >
                        <StageIcon className="w-6 h-6" />
                      </div>
                      <p className={`mt-2 text-sm ${
                        isCompleted ? 'text-green-600 font-medium' : 'text-gray-500'
                      }`}>
                        {stage.label}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                <div
                  className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-500"
                  style={{
                    width: `${(getStageIndex(report.status) / (stages.length - 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Incident Type</p>
                  <p className="text-lg text-gray-900">{report.incidentType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-lg text-gray-900">{report.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date Reported</p>
                  <p className="text-lg text-gray-900">{new Date(report.timestamp).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="text-lg text-gray-900">{new Date(report.lastUpdated || report.timestamp).toLocaleDateString()}</p>
                </div>
              </div>

              {report.statusNotes && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Status Notes</p>
                  <p className="text-lg text-gray-900">{report.statusNotes}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default TrackReport; 