/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useState, useContext, useEffect } from 'react'
import {
  auth
} from '../config/firebase'
import {
  GithubAuthProvider,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail
} from 'firebase/auth'

const provider = new GithubAuthProvider();
const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  async function signup(email, password, username) {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's profile with the username
      await updateProfile(user, {
        displayName: username
      });

      return user;
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error.message);
    }
  }

  async function loginWithGithub() {
    try {
      const auth = getAuth();
      const result = signInWithPopup(auth, provider)
      const user = result.user;
    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GithubAuthProvider.credentialFromError(error);
      // ...
    };
  }

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logout = () => {
    return signOut(auth).then(() => {
      // Ricarica la pagina dopo il logout
      window.location.href = '/';
    });
  }

  const updateUserProfile = async (profileData) => {
    if (!auth.currentUser) throw new Error('No user logged in');
    await updateProfile(auth.currentUser, profileData);
  };

  async function changePassword(currentPassword, newPassword) {
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      )
      
      // Re-autenticare l'utente
      await reauthenticateWithCredential(user, credential)
      
      // Cambiare la password
      await updatePassword(user, newPassword)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async function sendPasswordResetEmail(email) {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error(error.message);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Non settare automaticamente lo stato
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [])

  const value = {
    user,
    loading,
    signup,
    login,
    loginWithGithub,
    logout,
    updateUserProfile,
    changePassword,
    sendPasswordResetEmail,
    isGithubUser: user?.providerData[0]?.providerId === 'github.com'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )

}
