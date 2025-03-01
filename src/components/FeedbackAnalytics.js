import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  StarIcon,
  ChatBubbleBottomCenterTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

function FeedbackAnalytics() {
  const [feedbackData, setFeedbackData] = useState({
    averageRating: 0,
    totalFeedback: 0,
    categoryBreakdown: {},
    recentFeedback: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const feedbackRef = collection(db, 'feedback');
        const q = query(feedbackRef, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        
        let totalRating = 0;
        const categoryCount = {};
        const recentFeedback = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          totalRating += data.rating;
          
          // Update category breakdown
          categoryCount[data.category] = (categoryCount[data.category] || 0) + 1;
          
          // Collect recent feedback
          if (recentFeedback.length < 5) {
            recentFeedback.push({ id: doc.id, ...data });
          }
        });

        setFeedbackData({
          averageRating: totalRating / querySnapshot.size || 0,
          totalFeedback: querySnapshot.size,
          categoryBreakdown: categoryCount,
          recentFeedback
        });
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Feedback Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center">
            <StarIcon className="h-6 w-6 text-red-600" />
            <span className="ml-2 text-lg font-semibold">Average Rating</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {feedbackData.averageRating.toFixed(1)}
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center">
            <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-red-600" />
            <span className="ml-2 text-lg font-semibold">Total Feedback</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {feedbackData.totalFeedback}
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center">
            <ChartBarIcon className="h-6 w-6 text-red-600" />
            <span className="ml-2 text-lg font-semibold">Categories</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {Object.keys(feedbackData.categoryBreakdown).length}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(feedbackData.categoryBreakdown).map(([category, count]) => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-gray-600 capitalize">{category.replace('_', ' ')}</span>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-200 rounded-full mr-3">
                  <div
                    className="h-2 bg-red-600 rounded-full"
                    style={{
                      width: `${(count / feedbackData.totalFeedback) * 100}%`
                    }}
                  />
                </div>
                <span className="text-gray-600">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Feedback</h3>
        <div className="space-y-4">
          {feedbackData.recentFeedback.map((feedback) => (
            <div
              key={feedback.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-gray-600">
                  {feedback.userEmail}
                </span>
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1">{feedback.rating}</span>
                </div>
              </div>
              <p className="text-gray-700">{feedback.comment}</p>
              <div className="mt-2 text-sm text-gray-500">
                {new Date(feedback.timestamp.seconds * 1000).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default FeedbackAnalytics; 