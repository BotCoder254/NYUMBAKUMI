import { motion } from 'framer-motion';
import FeedbackForm from '../components/FeedbackForm';
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

function Feedback() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <ChatBubbleBottomCenterTextIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Citizen Feedback</h1>
          <p className="mt-2 text-lg text-gray-600">
            Your feedback helps us improve our services and better serve the community.
          </p>
        </motion.div>

        <FeedbackForm />
      </div>
    </div>
  );
}

export default Feedback; 