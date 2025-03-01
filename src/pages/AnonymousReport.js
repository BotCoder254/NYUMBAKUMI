import { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { ShieldExclamationIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function AnonymousReport() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    incidentType: '',
    location: '',
    county: '',
    date: '',
    time: '',
    description: '',
    evidenceUrl: '',
    severity: 'low',
    additionalInfo: ''
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const reportRef = collection(db, 'anonymous_reports');
      const reportData = {
        ...formData,
        timestamp: new Date().toISOString(),
        status: formData.severity === 'critical' ? 'urgent' : 'pending',
        reportType: 'anonymous',
        lastUpdated: new Date().toISOString(),
        statusNotes: formData.severity === 'critical' ? 'Critical anonymous report under urgent review.' : 'Anonymous report received and pending review.'
      };

      await addDoc(reportRef, reportData);
      
      toast.success('Report submitted successfully!');
      setFormData({
        incidentType: '',
        location: '',
        county: '',
        date: '',
        time: '',
        description: '',
        evidenceUrl: '',
        severity: 'low',
        additionalInfo: ''
      });
    } catch (error) {
      toast.error('Error submitting report. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-center mb-8">
            <ShieldExclamationIcon className="h-12 w-12 text-red-600" />
            <h1 className="ml-4 text-3xl font-bold text-gray-900">
              Anonymous Crime Report
            </h1>
          </div>

          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              Important Information
            </h2>
            <ul className="list-disc list-inside text-blue-700 space-y-2">
              <li>Your report will be completely anonymous</li>
              <li>No personal information is required or stored</li>
              <li>Please provide as much detail as possible</li>
              <li>False reporting is a criminal offense</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of Incident
                </label>
                <select
                  name="incidentType"
                  value={formData.incidentType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select incident type</option>
                  <option value="theft">Theft</option>
                  <option value="assault">Assault</option>
                  <option value="fraud">Fraud</option>
                  <option value="vandalism">Vandalism</option>
                  <option value="drug_related">Drug Related</option>
                  <option value="corruption">Corruption</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity Level
                </label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                {formData.severity === 'critical' && (
                  <p className="mt-2 text-sm text-red-600">
                    Critical incidents will be escalated for immediate review.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Enter incident location"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  County
                </label>
                <select
                  name="county"
                  value={formData.county}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select county</option>
                  {counties.map((county) => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Incident
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time of Incident
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description of Incident
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Please provide as much detail as possible about the incident..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows="3"
                placeholder="Any additional details that might be helpful..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evidence URL (Optional)
              </label>
              <input
                type="url"
                name="evidenceUrl"
                value={formData.evidenceUrl}
                onChange={handleChange}
                placeholder="Link to photos or videos (if any)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition duration-300 disabled:opacity-50"
              >
                {loading ? 'Submitting Report...' : 'Submit Anonymous Report'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default AnonymousReport; 