import { motion } from 'framer-motion';
import {
  ClipboardDocumentListIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

function AdminReportDetails({ report, onClose, onStatusUpdate }) {
  const statusOptions = ['pending', 'in progress', 'resolved', 'rejected'];

  if (!report) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Report Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ClipboardDocumentListIcon className="h-6 w-6 text-primary-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Incident Type</p>
                  <p className="text-lg text-gray-900">
                    {report.incidentType.charAt(0).toUpperCase() + report.incidentType.slice(1)}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Update Status
                </label>
                <select
                  value={report.status}
                  onChange={(e) => onStatusUpdate(report.id, e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <GlobeAltIcon className="h-6 w-6 text-primary-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">County</p>
                  <p className="text-lg text-gray-900">{report.county}</p>
                </div>
              </div>

              <div className="flex items-center">
                <MapPinIcon className="h-6 w-6 text-primary-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-lg text-gray-900">{report.location}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <CalendarIcon className="h-6 w-6 text-primary-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-lg text-gray-900">{report.date}</p>
                </div>
              </div>

              <div className="flex items-center">
                <ClockIcon className="h-6 w-6 text-primary-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Time</p>
                  <p className="text-lg text-gray-900">{report.time}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <DocumentTextIcon className="h-6 w-6 text-primary-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-lg text-gray-900 whitespace-pre-wrap">
                  {report.description}
                </p>
              </div>
            </div>

            {report.additionalInfo && (
              <div className="flex items-start">
                <DocumentTextIcon className="h-6 w-6 text-primary-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Additional Information</p>
                  <p className="text-lg text-gray-900 whitespace-pre-wrap">
                    {report.additionalInfo}
                  </p>
                </div>
              </div>
            )}

            {report.evidenceUrls && report.evidenceUrls.length > 0 && (
              <div className="flex items-start">
                <DocumentTextIcon className="h-6 w-6 text-primary-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Evidence</p>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    {report.evidenceUrls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        View Evidence {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center">
              <UserIcon className="h-6 w-6 text-primary-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Reporter ID</p>
                <p className="text-lg text-gray-900">{report.userId}</p>
              </div>
            </div>

            <div className="flex items-center">
              <ClockIcon className="h-6 w-6 text-primary-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Submitted</p>
                <p className="text-lg text-gray-900">
                  {new Date(report.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AdminReportDetails; 