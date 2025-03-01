import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

function SubscriptionForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailServiceStatus, setEmailServiceStatus] = useState(null);

  useEffect(() => {
    checkEmailService();
  }, []);

  const checkEmailService = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/email/status');
      const status = await response.json();
      setEmailServiceStatus(status);
    } catch (error) {
      console.error('Error checking email service:', error);
      setEmailServiceStatus({ status: 'error', message: 'Email service unavailable' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (emailServiceStatus?.status !== 'ready') {
      toast.error('Email service is currently unavailable. Please try again later.');
      return;
    }

    setLoading(true);
    try {
      // Save to Firestore
      await addDoc(collection(db, 'subscribers'), {
        email,
        isActive: true,
        createdAt: new Date().toISOString()
      });

      // Send confirmation email
      const response = await fetch('http://localhost:5000/api/email/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-red-50 p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Subscribe to Our Newsletter
      </h3>
      <p className="text-gray-600 mb-4">
        Stay updated with safety tips, crime prevention advice, and community updates.
      </p>

      {emailServiceStatus && emailServiceStatus.status !== 'ready' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {emailServiceStatus.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading || emailServiceStatus?.status !== 'ready'}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 disabled:opacity-50"
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </motion.button>
      </form>
    </div>
  );
}

export default SubscriptionForm; 