import { initializeApp } from 'firebase/app'
import { getAuth, GithubAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAWguBF2IAL6eRa_VzTm4fy_OvhyDqDHqI",
    authDomain: "reacktor-a1b6a.firebaseapp.com",
    databaseURL: "https://reacktor-a1b6a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "reacktor-a1b6a",
    storageBucket: "reacktor-a1b6a.firebasestorage.app",
    messagingSenderId: "833618544477",
    appId: "1:833618544477:web:9c03b416e859ac5a5e4ab4",
    measurementId: "G-0PLNGXX5HG"
  };

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// GitHub provider
export const githubProvider = new GithubAuthProvider()


