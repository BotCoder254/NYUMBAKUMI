const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin with service account
const serviceAccount = require('../config/twitterclone-47ebf-firebase-adminsdk-ffeu2-be9764133c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

async function verifyAndFixAdmin() {
  try {
    // Get user by email
    const userRecord = await auth.getUserByEmail('admin@crimereportkenya.com');
    
    // Verify and set custom claims
    await auth.setCustomUserClaims(userRecord.uid, {
      admin: true
    });

    // Update Firestore document
    await db.collection('users').doc(userRecord.uid).update({
      role: 'admin',
      permissions: [
        'manage_reports',
        'manage_users',
        'view_analytics',
        'manage_officers',
        'manage_resources',
        'manage_blog',
        'access_admin_panel',
        'export_data'
      ],
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Force token refresh
    await auth.revokeRefreshTokens(userRecord.uid);

    console.log('Admin permissions verified and updated successfully');
    console.log('Admin UID:', userRecord.uid);
    console.log('Please sign out and sign back in to refresh permissions');

    process.exit(0);
  } catch (error) {
    console.error('Error verifying admin:', error);
    process.exit(1);
  }
}

verifyAndFixAdmin(); 