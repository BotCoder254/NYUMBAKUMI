import { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider,
  db 
} from '../config/firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInAnonymously
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  async function signup(email, password, role = 'citizen') {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Check if this is the first user (make them admin)
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const isFirstUser = usersSnapshot.empty;
      
      const userRole = isFirstUser ? 'admin' : role;
      
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        createdAt: new Date().toISOString(),
        role: userRole,
        status: 'active'
      });
      
      // Update local role state
      setUserRole(userRole);
      return { ...result, role: userRole };
    } catch (error) {
      console.error('Error in signup:', error);
      throw error;
    }
  }

  async function loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        // Check if this is the first user (make them admin)
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        const isFirstUser = usersSnapshot.empty;
        
        const userRole = isFirstUser ? 'admin' : 'citizen';
        
        await setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          createdAt: new Date().toISOString(),
          role: userRole,
          status: 'active'
        });
        
        // Update local role state
        setUserRole(userRole);
        return { ...result, role: userRole };
      } else {
        const role = userDoc.data().role;
        setUserRole(role);
        return { ...result, role };
      }
    } catch (error) {
      console.error('Error in Google Sign In:', error);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Force token refresh to get latest claims
      await result.user.getIdToken(true);
      const role = await checkUserRole(result.user);
      return { ...result, role };
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }

  function logout() {
    setUserRole(null);
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function anonymousLogin() {
    return signInAnonymously(auth);
  }

  async function checkUserRole(user) {
    if (!user) {
      setUserRole(null);
      return null;
    }

    try {
      // Get the ID token result to check custom claims
      const idTokenResult = await user.getIdTokenResult();
      
      // Get user document from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      let role = 'citizen';
      
      // Check for admin claim in token
      if (idTokenResult.claims.admin) {
        role = 'admin';
      } else if (userDoc.exists()) {
        // If no admin claim, check Firestore role
        role = userDoc.data()?.role || 'citizen';
      }

      // If user document doesn't exist, create it
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          createdAt: new Date().toISOString(),
          role: role,
          status: 'active'
        });
      }

      setUserRole(role);
      return role;
    } catch (error) {
      console.error('Error checking user role:', error);
      return 'citizen';
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await checkUserRole(user);
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    anonymousLogin,
    checkUserRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 