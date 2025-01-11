/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState, useContext, useEffect } from 'react'
import {
  auth,
  githubProvider
} from '../config/firebase'
import {
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
import Loader from '../components/Loader'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function signup(email, password, username) {
    try {
      setError(null)
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Aggiorna il profilo utente con il username
      await updateProfile(userCredential.user, {
        displayName: username
      })

      return userCredential.user
    } catch (error) {
      setError({
        code: error.code,
        message: error.message
      })
      console.error('Signup error:', error)
      throw error
    }
  }

  async function loginWithGithub() {
    try {
      setError(null)
      const auth = getAuth()
      const result = await signInWithPopup(auth, githubProvider)
      return result.user
    } catch (error) {
      setError({
        code: error.code,
        message: error.message,
        email: error.customData?.email,
        credential: error.credential
      })
      console.error('GitHub Login Error:', error)
      throw error
    }
  }

  async function login(email, password) {
    try {
      setError(null)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      setError({
        code: error.code,
        message: error.message
      })
      console.error('Login error:', error)
      throw error
    }
  }

  async function logout() {
    try {
      setError(null)
      await signOut(auth)
      // Ricarica la pagina dopo il logout
      window.location.href = '/';
    } catch (error) {
      setError({
        code: error.code,
        message: error.message
      })
      console.error('Logout error:', error)
      throw error
    }
  }

  async function updateUserProfile(profileData) {
    if (!auth.currentUser) throw new Error('No user logged in');
    try {
      setError(null)
      await updateProfile(auth.currentUser, profileData);
    } catch (error) {
      setError({
        code: error.code,
        message: error.message
      })
      console.error('Update profile error:', error)
      throw error
    }
  };

  async function changePassword(currentPassword, newPassword) {
    try {
      setError(null)
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      )
      
      // Re-autenticare l'utente
      await reauthenticateWithCredential(user, credential)
      
      // Cambiare la password
      await updatePassword(user, newPassword)
    } catch (error) {
      setError({
        code: error.code,
        message: error.message
      })
      console.error('Change password error:', error)
      throw error
    }
  }

  async function sendPasswordResetEmail(email) {
    try {
      setError(null)
      await firebaseSendPasswordResetEmail(auth, email)
    } catch (error) {
      setError({
        code: error.code,
        message: error.message
      })
      console.error('Password reset error:', error)
      throw error
    }
  }

  async function deleteAccount(password) {
    try {
      setError(null)
      const currentUser = auth.currentUser

      if (!currentUser) {
        throw new Error('No user is currently signed in')
      }

      // Riautenticazione con credenziali
      const credential = EmailAuthProvider.credential(currentUser.email, password)
      await reauthenticateWithCredential(currentUser, credential)

      // Eliminazione account
      await currentUser.delete()

      // Reindirizzamento dopo eliminazione
      window.location.href = '/signup'
    } catch (error) {
      setError({
        code: error.code,
        message: error.message
      })
      console.error('Account deletion error:', error)
      throw error
    }
  }

  const forceStopLoading = () => {
    console.warn('🚨 Forzo interruzione caricamento');
    setLoading(false)
  }

  useEffect(() => {
    console.log('🔍 Inizio monitoraggio stato autenticazione');
    const unsubscribe = onAuthStateChanged(
      auth, 
      (currentUser) => {
        console.log('👤 Stato utente cambiato:', currentUser ? 'Utente autenticato' : 'Nessun utente');
        setUser(currentUser)
        setLoading(false)
      }, 
      (authError) => {
        console.error('❌ Errore nel cambio di stato di autenticazione:', authError)
        setError({
          code: authError.code,
          message: authError.message
        })
        setLoading(false)
      }
    )

    // Aggiungi un timeout per forzare lo sblocco del caricamento
    const loadingTimeout = setTimeout(() => {
      console.warn('⏰ Timeout caricamento autenticazione');
      forceStopLoading()
    }, 10000)  // 10 secondi

    // Cleanup
    return () => {
      unsubscribe()
      clearTimeout(loadingTimeout)
    }
  }, [])

  const value = {
    user,
    loading,
    error,
    forceStopLoading,
    signup,
    login,
    loginWithGithub,
    logout,
    updateUserProfile,
    changePassword,
    sendPasswordResetEmail,
    deleteAccount
  }

  return (
    <AuthContext.Provider value={value}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  )
}
