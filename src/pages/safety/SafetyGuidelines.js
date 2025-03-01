import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  HomeIcon,
  UserGroupIcon,
  DevicePhoneMobileIcon,
  LockClosedIcon,
  ExclamationTriangleIcon,
  BellAlertIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

function SafetyGuidelines() {
  const guidelines = [
    {
      title: 'Personal Safety',
      icon: ShieldCheckIcon,
      tips: [
        'Stay alert and aware of your surroundings at all times',
        'Avoid walking alone in poorly lit or isolated areas',
        'Keep emergency contacts readily available',
        'Trust your instincts - if something feels wrong, leave the situation',
        'Share your location with trusted contacts when traveling'
      ]
    },
    {
      title: 'Home Security',
      icon: HomeIcon,
      tips: [
        'Install quality locks on all doors and windows',
        'Use security lighting around your property',
        'Don\'t advertise when you\'re away from home on social media',
        'Keep valuables in a secure safe',
        'Join or create a neighborhood watch program'
      ]
    },
    {
      title: 'Community Safety',
      icon: UserGroupIcon,
      tips: [
        'Get to know your neighbors',
        'Report suspicious activities to authorities',
        'Participate in community safety meetings',
        'Support local crime prevention initiatives',
        'Share safety information with community members'
      ]
    },
    {
      title: 'Digital Safety',
      icon: DevicePhoneMobileIcon,
      tips: [
        'Use strong, unique passwords for all accounts',
        'Enable two-factor authentication when available',
        'Be cautious with personal information online',
        'Regularly update your devices and applications',
        'Avoid using public Wi-Fi for sensitive transactions'
      ]
    },
    {
      title: 'Emergency Preparedness',
      icon: BellAlertIcon,
      tips: [
        'Create an emergency contact list',
        'Prepare an emergency kit with essential supplies',
        'Know evacuation routes from your area',
        'Keep important documents in a secure, accessible location',
        'Learn basic first aid and CPR'
      ]
    },
    {
      title: 'Fraud Prevention',
      icon: LockClosedIcon,
      tips: [
        'Never share personal banking information',
        'Verify the identity of anyone requesting sensitive information',
        'Monitor your financial statements regularly',
        'Be wary of unsolicited phone calls or emails',
        'Report suspicious financial activity immediately'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Safety Guidelines
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your safety is our priority. Follow these comprehensive guidelines to protect yourself,
              your loved ones, and your community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guidelines.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition duration-300"
                >
                  <div className="flex items-center mb-4">
                    <Icon className="h-8 w-8 text-red-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start">
                        <span className="text-red-600 mr-2">•</span>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-red-50 rounded-lg p-6"
          >
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mr-3" />
              <h2 className="text-xl font-semibold text-red-900">
                Remember
              </h2>
            </div>
            <p className="text-red-700">
              These guidelines are meant to help prevent crime and increase safety awareness.
              In case of emergency, always contact the appropriate authorities immediately.
              Your safety should always be your first priority.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default SafetyGuidelines; 