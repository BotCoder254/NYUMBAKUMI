// Report Schema
export const reportSchema = {
  title: '',
  description: '',
  location: '',
  county: '',
  category: '',
  evidence: [], // Array of file URLs
  status: 'pending', // pending, investigating, resolved, closed
  assigned: false,
  assignedTo: null, // Officer details when assigned
  assignedAt: null,
  anonymous: false,
  reportedBy: null, // User details or null if anonymous
  createdAt: null,
  updatedAt: null,
  trackingId: '', // Unique tracking ID for the report
  priority: 'medium', // low, medium, high
  tags: [], // Array of tags for categorization
};

// Officer Schema
export const officerSchema = {
  name: '',
  email: '',
  phone: '',
  rank: '',
  county: '',
  station: '',
  photo: '', // URL to officer's photo
  available: true,
  assignedCases: [], // Array of case IDs
  createdAt: null,
  updatedAt: null,
  status: 'active', // active, on-leave, inactive
  specialization: [], // Array of specializations
  badgeNumber: '',
  serviceYears: 0,
};

// User Schema
export const userSchema = {
  email: '',
  displayName: '',
  photoURL: '',
  role: 'user', // user, moderator, admin
  createdAt: null,
  lastLogin: null,
  county: '',
  phoneNumber: '',
  notifications: [], // Array of notification objects
  reportHistory: [], // Array of report IDs
};

// Feedback Schema
export const feedbackSchema = {
  userId: '', // Optional, if user is logged in
  userEmail: '', // Optional, if user is logged in
  rating: 0, // 1-5 stars
  comment: '',
  category: '', // General Experience, Reporting Process, etc.
  createdAt: null,
  status: 'pending', // pending, reviewed
  anonymous: false,
};

// Blog Post Schema
export const blogPostSchema = {
  title: '',
  content: '',
  author: {
    id: '',
    name: '',
    photo: ''
  },
  tags: [], // Array of tags for categorization
  categories: [], // Array of predefined categories
  images: [], // Array of image URLs
  videos: [], // Array of video URLs
  status: 'draft', // draft, published, archived
  createdAt: null,
  updatedAt: null,
  publishedAt: null,
  views: 0,
  likes: 0,
  comments: [], // Array of comment objects
  featured: false,
  seoDescription: '',
  readTime: 0, // Estimated read time in minutes
}; 