import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Define role hierarchy and permissions
const ROLE_HIERARCHY = {
  admin: 3,
  moderator: 2,
  citizen: 1,
  anonymous: 0
};

const ROLE_PERMISSIONS = {
  admin: [
    'manage_reports',
    'manage_users',
    'view_analytics',
    'manage_officers',
    'manage_resources',
    'manage_blog',
    'access_admin_panel',
    'export_data'
  ],
  moderator: [
    'view_reports',
    'update_reports',
    'view_analytics',
    'access_admin_panel'
  ],
  citizen: [
    'submit_report',
    'view_own_reports',
    'update_profile'
  ],
  anonymous: [
    'view_public_reports',
    'submit_anonymous_report'
  ]
};

function AdminRoute({ children }) {
  const { currentUser, userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      if (!currentUser) {
        setLoading(false);
        setHasPermission(false);
        return;
      }

      try {
        // Get the ID token result to check custom claims
        const idTokenResult = await currentUser.getIdTokenResult();
        
        // Get user document from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        
        // Check both custom claims and Firestore role
        const isAdmin = 
          idTokenResult.claims.admin || 
          (userDoc.exists() && userDoc.data()?.role === 'admin');

        // Verify admin has necessary permissions
        const hasAdminPerms = isAdmin && 
          ROLE_PERMISSIONS['admin']?.includes('access_admin_panel');
        
        setHasPermission(hasAdminPerms);
      } catch (error) {
        console.error('Error checking permissions:', error);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };

    checkPermission();
  }, [currentUser, userRole]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return hasPermission ? children : <Navigate to="/" />;
}

export { ROLE_HIERARCHY, ROLE_PERMISSIONS };
export default AdminRoute; 