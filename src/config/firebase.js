import { initializeApp } from 'firebase/app'
import { getAuth, GithubAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

console.log('Firebase Config:', {
    apiKey: firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 5) + '...' : 'Missing',
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
});

try {
    const app = initializeApp(firebaseConfig)
    console.log('Firebase App Initialized Successfully')
    
    export const auth = getAuth(app)
    export const db = getFirestore(app)
    export const storage = getStorage(app)

    // GitHub provider
    export const githubProvider = new GithubAuthProvider()
} catch (error) {
    console.error('Firebase Initialization Error:', error)
    throw error
}
