import { initializeApp } from 'firebase/app'
import { getAuth, GithubAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Log dettagliato della configurazione
console.log('Firebase Config:', {
    apiKey: firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 5) + '...' : 'Missing',
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
    measurementId: firebaseConfig.measurementId
});

const app = initializeApp(firebaseConfig)
console.log('Firebase App Initialized Successfully')

const auth = getAuth(app)
console.log('Firebase Auth Initialized')

const db = getFirestore(app)
console.log('Firestore Initialized')

// GitHub provider
const githubProvider = new GithubAuthProvider()
console.log('GitHub Provider Created')

export { auth, db, githubProvider }
