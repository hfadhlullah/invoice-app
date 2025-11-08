import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './config';

export const AuthService = {
  // Login with email and password
  async login(email, password) {
    try {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  if (import.meta.env.DEV) console.log('✅ Login successful:', userCredential.user.email);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('❌ Login error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Logout
  async logout() {
    try {
  await signOut(auth);
  if (import.meta.env.DEV) console.log('✅ Logout successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Logout error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }
};
