import { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

function TrackReport() {
  const [trackingId, setTrackingId] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      toast.error('Please enter a tracking ID');
      return;
    }

    setLoading(true);
    try {
      const reportRef = doc(db, 'reports', trackingId);
      const reportSnap = await getDoc(reportRef);

      if (reportSnap.exists()) {
        setReport({ id: reportSnap.id, ...reportSnap.data() });
      } else {
        toast.error('No report found with this tracking ID');
        setReport(null);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'received':
        return 'bg-blue-100 text-blue-800';
      case 'under investigation':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Track Your Report</h2>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter your tracking ID"
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
          </div>
        </form>

        {report && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Report #{report.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Submitted on {new Date(report.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    report.status
                  )}`}
                >
                  {report.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Incident Type</h4>
                <p className="mt-1">{report.incidentType}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Location</h4>
                <p className="mt-1">{report.location}, {report.county}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Date & Time</h4>
                <p className="mt-1">{report.date} at {report.time}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                <p className="mt-1">
                  {new Date(report.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Description</h4>
              <p className="mt-1">{report.description}</p>
            </div>

            {report.statusNotes && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Status Notes</h4>
                <p className="mt-1">{report.statusNotes}</p>
              </div>
            )}

            {report.evidenceUrls?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Evidence Files</h4>
                <p className="mt-1">{report.evidenceUrls.length} file(s) attached</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackReport; 