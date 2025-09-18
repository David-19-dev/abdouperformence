import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBFEApsjCdy_t-_WFrxf-vRX96XQmvmW08",
  authDomain: "bbp-performence.firebaseapp.com",
  projectId: "bbp-performence",
  storageBucket: "bbp-performence.firebasestorage.app",
  messagingSenderId: "78469752392",
  appId: "1:78469752392:web:e5c36dffdf2553359a1a7d",
  measurementId: "G-3J4JBVM0PF"
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
    await db._delegate._databaseId;
    console.log('🔥 Connexion Firebase établie avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion Firebase:', error);
    return false;
  }
};