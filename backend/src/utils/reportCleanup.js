const admin = require('firebase-admin');

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const cleanupClosedReports = async () => {
  try {
    const db = admin.firestore();
    const now = new Date().getTime();
    const cutoffTime = new Date(now - TWENTY_FOUR_HOURS).toISOString();

    const closedReportsQuery = db.collection('reports')
      .where('status', '==', 'closed')
      .where('lastUpdated', '<=', cutoffTime);

    const snapshot = await closedReportsQuery.get();
    
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    
    console.log(`Successfully deleted ${snapshot.size} closed reports`);
    return { success: true, deletedCount: snapshot.size };
  } catch (error) {
    console.error('Error cleaning up reports:', error);
    return { success: false, error: error.message };
  }
};

// Schedule cleanup to run every hour
const scheduleCleanup = () => {
  setInterval(async () => {
    console.log('Running scheduled report cleanup...');
    await cleanupClosedReports();
  }, 60 * 60 * 1000); // Run every hour
};

module.exports = {
  cleanupClosedReports,
  scheduleCleanup
}; 