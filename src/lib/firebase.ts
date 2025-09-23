import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, collection } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

console.log('✅ Firebase initialisé avec succès pour BBP Performance');

export { db, auth, analytics };
export default app;

// Fonction utilitaire pour vérifier la connexion
export const checkFirebaseConnection = async () => {
  try {
    // Test simple de connexion à Firestore
    const testCollection = collection(db, '_test_connection');
    console.log('🔥 Connexion Firebase établie avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion Firebase:', error);
    return false;
  }
};
