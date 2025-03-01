import { motion } from 'framer-motion';
import {
  PhoneIcon,
  ShieldExclamationIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

function Resources() {
  const emergencyContacts = [
    { name: 'Police Emergency', number: '999', icon: ShieldExclamationIcon },
    { name: 'Anti-Terror Police', number: '0800 722 203', icon: ExclamationTriangleIcon },
    { name: 'Gender Violence', number: '1195', icon: HeartIcon },
    { name: 'Child Helpline', number: '116', icon: PhoneIcon },
    { name: 'Ambulance Services', number: '999', icon: HeartIcon },
    { name: 'Fire Emergency', number: '999', icon: ExclamationTriangleIcon }
  ];

  const resources = [
    {
      title: 'Safety Guidelines',
      description: 'Learn how to stay safe and protect yourself and your community.',
      icon: BookOpenIcon,
      link: '/safety/guidelines'
    },
    {
      title: 'Reporting Guide',
      description: 'Step-by-step guide on how to report incidents effectively.',
      icon: DocumentTextIcon,
      link: '/safety/reporting'
    },
    {
      title: 'Community Resources',
      description: 'Access local community support and assistance programs.',
      icon: GlobeAltIcon,
      link: '/safety/community'
    }
  ];

  const faqs = [
    {
      question: 'How do I submit an anonymous report?',
      answer: 'You can submit an anonymous report by clicking on the "Anonymous Report" button on the homepage. You don\'t need to create an account.'
    },
    {
      question: 'What happens after I submit a report?',
      answer: 'After submission, your report will be reviewed by our team. You\'ll receive a tracking ID to monitor the status of your report.'
    },
    {
      question: 'How can I track my report?',
      answer: 'Use the "Track Report" feature in the navigation menu. Enter your tracking ID to see the current status and updates.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Emergency Contacts Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <PhoneIcon className="h-8 w-8 text-red-600 mr-3" />
          Emergency Contacts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emergencyContacts.map((contact, index) => {
            const Icon = contact.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition duration-300"
              >
                <div className="flex items-center">
                  <Icon className="h-8 w-8 text-red-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <p className="text-red-600 font-bold">{contact.number}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Resources Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <BookOpenIcon className="h-8 w-8 text-red-600 mr-3" />
          Safety Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition duration-300"
              >
                <Icon className="h-8 w-8 text-red-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <a
                  href={resource.link}
                  className="text-red-600 hover:text-red-700 font-medium flex items-center"
                >
                  Learn More
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* FAQs Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <QuestionMarkCircleIcon className="h-8 w-8 text-red-600 mr-3" />
          Frequently Asked Questions
        </h2>
        <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

export default Resources; 