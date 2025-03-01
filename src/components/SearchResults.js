import { motion } from 'framer-motion';
import {
  CalendarIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

function SearchResults({ results, loading, error }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No reports found matching your search criteria.
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in progress': 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {results.map((report, index) => (
        <motion.div
          key={report.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {report.incidentType}
            </h3>
            <div className="flex space-x-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                  report.severity
                )}`}
              >
                {report.severity}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  report.status
                )}`}
              >
                {report.status}
              </span>
            </div>
          </div>

          <p className="text-gray-600 mb-4">{report.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <MapPinIcon className="h-4 w-4 mr-2" />
              {report.location}
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {new Date(report.timestamp.seconds * 1000).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-2" />
              {new Date(report.timestamp.seconds * 1000).toLocaleTimeString()}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default SearchResults; 