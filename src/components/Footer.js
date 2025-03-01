import { Link } from 'react-router-dom';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <ShieldExclamationIcon className="h-8 w-8 text-red-500" />
              <span className="ml-2 text-xl font-bold">Crime Report Kenya</span>
            </div>
            <p className="text-gray-400 mb-4">
              Together we can make Kenya safer through responsible reporting and
              community engagement. Your voice matters in the fight against crime.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/track-report"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Track Report
                </Link>
              </li>
              <li>
                <Link
                  to="/report-crime"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Report Crime
                </Link>
              </li>
              <li>
                <Link
                  to="/anonymous-report"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Anonymous Report
                </Link>
              </li>
              <li>
                <Link
                  to="/feedback"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/resources"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <Link
                  to="/feed"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Crime Feed
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Search Reports
                </Link>
              </li>
              <li>
                <a
                  href="https://www.nationalpolice.go.ke/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  National Police Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                Police Emergency: <span className="text-white">999</span>
              </li>
              <li className="text-gray-400">
                Anti-Terror Police: <span className="text-white">0800 722 203</span>
              </li>
              <li className="text-gray-400">
                Gender Violence: <span className="text-white">1195</span>
              </li>
              <li className="text-gray-400">
                Child Helpline: <span className="text-white">116</span>
              </li>
              <li className="text-gray-400">
                Report Corruption: <span className="text-white">0800 721 701</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Crime Report Kenya. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/privacy-policy"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                Terms of Service
              </Link>
              <Link
                to="/contact"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                Contact Us
              </Link>
              <Link
                to="/faq"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 