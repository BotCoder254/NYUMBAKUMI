const admin = require('firebase-admin');

// Initialize Firebase Admin using environment variables
const initializeFirebase = () => {
  try {
    const credentials = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS || '{}');
    
    admin.initializeApp({
      credential: admin.credential.cert(credentials)
    });
    
    console.log('Firebase Admin initialized successfully');
    return admin;
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
};

module.exports = initializeFirebase(); 