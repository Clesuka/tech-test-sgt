let app: unknown = null;
let auth: unknown = null;

// Initialize Firebase only in the browser and only when a valid API key is provided.
// This prevents the Firebase SDK from throwing `auth/invalid-api-key` during build or when env is not set.
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  try {
    // Dynamically import to avoid loading firebase on the server
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { initializeApp, getApps } = require('firebase/app');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getAuth } = require('firebase/auth');

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
  } catch (e) {
    // If initialization fails, keep auth null and log a concise message.
    // This avoids crashing the build or runtime when config is missing/invalid.
    // eslint-disable-next-line no-console
    console.warn('Firebase not initialized. Make sure NEXT_PUBLIC_FIREBASE_API_KEY is set and valid.');
  }
} else {
  // eslint-disable-next-line no-console
  if (typeof window !== 'undefined') console.warn('Skipping Firebase initialization: NEXT_PUBLIC_FIREBASE_API_KEY is not set.');
}

export { app as default, auth };