import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const cleanupClosedReports = async () => {
  try {
    const reportsRef = collection(db, 'reports');
    const closedReportsQuery = query(
      reportsRef,
      where('status', '==', 'closed')
    );

    const snapshot = await getDocs(closedReportsQuery);
    const now = new Date().getTime();

    const deletePromises = snapshot.docs
      .filter(doc => {
        const report = doc.data();
        const closedTime = report.lastUpdated ? new Date(report.lastUpdated).getTime() : 0;
        return (now - closedTime) >= TWENTY_FOUR_HOURS;
      })
      .map(doc => deleteDoc(doc.ref));

    await Promise.all(deletePromises);
    
    return { success: true, deletedCount: deletePromises.length };
  } catch (error) {
    console.error('Error cleaning up reports:', error);
    return { success: false, error: error.message };
  }
}; 