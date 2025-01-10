// Debug environment variables
console.log('Firebase Environment Variables:', {
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY ? 'Present' : 'Missing',
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'Present' : 'Missing',
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'Present' : 'Missing',
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? 'Present' : 'Missing',
  VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? 'Present' : 'Missing',
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID ? 'Present' : 'Missing',
});

// Validate Firebase configuration
try {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  console.log('Firebase Config Validation:', {
    apiKeyValid: !!firebaseConfig.apiKey,
    authDomainValid: !!firebaseConfig.authDomain,
    projectIdValid: !!firebaseConfig.projectId,
    storageBucketValid: !!firebaseConfig.storageBucket,
    messagingSenderIdValid: !!firebaseConfig.messagingSenderId,
    appIdValid: !!firebaseConfig.appId,
  });
} catch (error) {
  console.error('Firebase Config Validation Error:', error);
}
