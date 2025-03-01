const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin with service account
const serviceAccount = require('../config/twitterclone-47ebf-firebase-adminsdk-ffeu2-be9764133c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

// Admin user details
const adminUser = {
  email: 'admin@crimereportkenya.com',
  password: 'Admin@CRK2024',
  displayName: 'Admin User'
};

async function createAdminUser() {
  try {
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: adminUser.email,
      password: adminUser.password,
      displayName: adminUser.displayName,
      emailVerified: true
    });

    // Set custom claims for admin role
    await auth.setCustomUserClaims(userRecord.uid, {
      admin: true
    });

    // Create admin document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email: adminUser.email,
      displayName: adminUser.displayName,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('Admin user created successfully');
    console.log('Email:', adminUser.email);
    console.log('Password:', adminUser.password);
    console.log('UID:', userRecord.uid);

    // Exit the process
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser(); 