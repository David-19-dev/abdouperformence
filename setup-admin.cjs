const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

// Configuration Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function setupAdmin() {
  try {
    // Se connecter avec l'utilisateur admin
    const userCredential = await signInWithEmailAndPassword(auth, 'admin@bambaperformance.com', '!*$Root-1!*$');
    const user = userCredential.user;

    // Ajouter l'utilisateur dans Firestore avec le rôle admin
    await setDoc(doc(db, 'users', user.uid), {
      email: 'admin@bambaperformance.com',
      role: 'admin',
      full_name: 'Administrateur BBP',
      created_at: new Date(),
      uid: user.uid
    });

    console.log('✅ Utilisateur admin configuré avec succès dans Firestore');
    console.log('📧 Email: admin@bambaperformance.com');
    console.log('🔑 Mot de passe: !*$Root-1!*$');
    console.log('🆔 UID:', user.uid);

  } catch (error) {
    console.error('❌ Erreur lors de la configuration admin:', error);
  }
}

setupAdmin();
