import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../config/firebase';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

function ReportCrime() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);

  const counties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu', 'Garissa',
    'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
    'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
    'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
    'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu',
    'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka Nithi', 'Trans Nzoia', 'Turkana',
    'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
  ];

  const [formData, setFormData] = useState({
    incidentType: '',
    date: '',
    time: '',
    location: '',
    county: '',
    description: '',
    evidenceFiles: [],
    additionalInfo: '',
    severity: 'low',
    isPublic: false
  });

  const steps = [
    { number: 1, title: 'Incident Details' },
    { number: 2, title: 'Location & Description' },
    { number: 3, title: 'Evidence Upload' },
    { number: 4, title: 'Review & Submit' },
    { number: 5, title: 'Submission Confirmation' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      evidenceFiles: [...prev.evidenceFiles, ...files]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      evidenceFiles: prev.evidenceFiles.filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.incidentType || !formData.date || !formData.time) {
          toast.error('Please fill in all required fields');
          return false;
        }
        break;
      case 2:
        if (!formData.location || !formData.county || !formData.description) {
          toast.error('Please fill in all required fields');
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const uploadEvidence = async () => {
    if (!formData.evidenceFiles || formData.evidenceFiles.length === 0) {
      return [];
    }

    const urls = [];
    for (const file of formData.evidenceFiles) {
      const storageRef = ref(storage, `evidence/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      urls.push(url);
    }
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;
      if (!userId) {
        toast.error('User not authenticated');
        return;
      }

      const evidenceUrls = await uploadEvidence();
      
      const reportData = {
        incidentType: formData.incidentType,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        county: formData.county,
        description: formData.description,
        additionalInfo: formData.additionalInfo || '',
        evidenceUrls,
        userId,
        timestamp: new Date().toISOString(),
        status: formData.severity === 'critical' ? 'urgent' : 'received',
        severity: formData.severity,
        lastUpdated: new Date().toISOString(),
        statusNotes: formData.severity === 'critical' ? 'Critical report under urgent review.' : 'Report received and pending review.',
        isPublic: formData.isPublic
      };

      const docRef = await addDoc(collection(db, 'reports'), reportData);
      setSubmittedReport({
        ...reportData,
        id: docRef.id
      });
      toast.success('Report submitted successfully!');
      setCurrentStep(5);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <div className="mr-3">
                  <span className="text-sm font-medium text-gray-700">Make Report Public</span>
                  <p className="text-sm text-gray-500">
                    Public reports will be visible in the community crime feed
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className={`block w-14 h-8 rounded-full transition-colors duration-200 ease-in-out ${
                    formData.isPublic ? 'bg-red-600' : 'bg-gray-200'
                  }`}>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${
                      formData.isPublic ? 'transform translate-x-6' : ''
                    }`} />
                  </div>
                </div>
              </label>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
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
                  <option key={county} value={county}>
                    {county}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specific Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Enter specific location details"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
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
                placeholder="Please provide detailed description of what happened..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Evidence (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500">
                      <span>Upload files</span>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF up to 10MB each
                  </p>
                </div>
              </div>
            </div>

            {formData.evidenceFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Selected Files:
                </h4>
                <ul className="space-y-2">
                  {formData.evidenceFiles.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-600">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information (Optional)
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows="3"
                placeholder="Any other relevant information..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Review Your Report</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Incident Type</p>
                  <p className="mt-1">{formData.incidentType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date & Time</p>
                  <p className="mt-1">{formData.date} at {formData.time}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">County</p>
                  <p className="mt-1">{formData.county}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="mt-1">{formData.location}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="mt-1">{formData.description}</p>
              </div>
              {formData.additionalInfo && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Additional Information</p>
                  <p className="mt-1">{formData.additionalInfo}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-500">Evidence Files</p>
                <p className="mt-1">
                  {formData.evidenceFiles.length} file(s) attached
                </p>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Report Submitted Successfully
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500 mb-2">
                Your Tracking ID
              </p>
              <p className="text-xl font-mono font-bold text-gray-900">
                {submittedReport?.id}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Save this ID to track the status of your report
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Go to Dashboard
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    incidentType: '',
                    date: '',
                    time: '',
                    location: '',
                    county: '',
                    description: '',
                    evidenceFiles: [],
                    additionalInfo: '',
                    severity: 'low',
                    isPublic: false
                  });
                  setCurrentStep(1);
                  setSubmittedReport(null);
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition duration-300"
              >
                Submit Another Report
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {currentStep < 5 && (
          <div className="mb-8">
            <div className="relative flex items-center justify-between mb-8">
              <div className="absolute top-1/2 h-0.5 w-full bg-gray-200 -z-10" />
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`flex flex-col items-center ${
                    step.number < currentStep
                      ? 'text-green-600'
                      : step.number === currentStep
                      ? 'text-red-600'
                      : 'text-gray-300'
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 bg-white ${
                      step.number < currentStep
                        ? 'border-green-600 bg-green-600 text-white'
                        : step.number === currentStep
                        ? 'border-red-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {step.number < currentStep ? (
                      <CheckCircleIcon className="w-6 h-6" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium whitespace-nowrap ${
                      step.number === currentStep ? 'text-gray-900' : ''
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {renderStepContent()}

          {currentStep < 5 && (
            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeftIcon className="w-5 h-5 mr-2" />
                  Back
                </button>
              )}
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-300 ml-auto"
                >
                  Next
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 text-white px-8 py-2 rounded-lg hover:bg-red-700 transition duration-300 disabled:opacity-50 ml-auto"
                >
                  {loading ? 'Submitting...' : 'Submit Report'}
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ReportCrime; 