import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  UserGroupIcon, 
  LockClosedIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';
import BlogSection from '../components/BlogSection';
import SubscriptionForm from '../components/SubscriptionForm';
import ContactForm from '../components/ContactForm';

function Home() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Kenya Police"
            className="w-full h-full object-cover filter brightness-50"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            {...fadeIn}
            className="max-w-3xl text-white"
          >
            <h1 className="text-5xl font-bold mb-6">
              Report Crime Safely and Securely in Kenya
            </h1>
            <p className="text-xl mb-8">
              Your voice matters in making Kenya safer. Report incidents anonymously or create an account to track your reports.
            </p>
            <div className="space-x-4">
              <Link
                to="/report-crime"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300"
              >
                Report a Crime
              </Link>
              <Link
                to="/anonymous-report"
                className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition duration-300"
              >
                Report Anonymously
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose Our Platform?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide a secure and efficient way to report crimes while ensuring your safety and privacy.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <ShieldCheckIcon className="h-12 w-12 text-red-600" />,
                title: "Secure Reporting",
                description: "Your reports are encrypted and stored securely"
              },
              {
                icon: <UserGroupIcon className="h-12 w-12 text-red-600" />,
                title: "Anonymous Options",
                description: "Choose to report anonymously or create an account"
              },
              {
                icon: <LockClosedIcon className="h-12 w-12 text-red-600" />,
                title: "Data Privacy",
                description: "Your personal information is protected"
              },
              {
                icon: <ChartBarIcon className="h-12 w-12 text-red-600" />,
                title: "Track Progress",
                description: "Monitor the status of your reported cases"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-xl text-center"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <BlogSection />

      {/* Newsletter and Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <SubscriptionForm />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-600">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-xl mb-8">
              Join thousands of citizens who are making Kenya safer through responsible reporting.
            </p>
            <Link
              to="/register"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
            >
              Create an Account
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home; 