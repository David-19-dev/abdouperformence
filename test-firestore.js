// Script de test pour vérifier la connexion Firestore et les données
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBFEApsjCdy_t-_WFrxf-vRX96XQmvmW08",
  authDomain: "bbp-performence.firebaseapp.com",
  projectId: "bbp-performence",
  storageBucket: "bbp-performence.firebasestorage.app",
  messagingSenderId: "78469752392",
  appId: "1:78469752392:web:e5c36dffdf2553359a1a7d",
  measurementId: "G-3J4JBVM0PF"
};

async function testFirestore() {
  try {
    console.log('🔄 Test de connexion Firestore...');

    // Initialiser Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('✅ Firebase initialisé');

    // Tester la connexion
    const galleryCollection = collection(db, 'gallery');
    const galleryQuery = query(galleryCollection, orderBy('created_at', 'desc'));
    const gallerySnapshot = await getDocs(galleryQuery);

    console.log(`📊 Documents trouvés dans 'gallery': ${gallerySnapshot.docs.length}`);

    if (gallerySnapshot.docs.length === 0) {
      console.log('⚠️  Aucun document trouvé dans la collection gallery');
      console.log('💡 Vous devez ajouter des vidéos via l\'admin GalleryManager');
    } else {
      console.log('📋 Liste des documents:');
      gallerySnapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        console.log(`${index + 1}. ${data.title || 'Sans titre'} (${data.type || 'unknown'})`);
        console.log(`   - Catégorie: ${data.category || 'Non définie'}`);
        console.log(`   - Type: ${data.type || 'Non défini'}`);
        console.log(`   - URL image: ${data.image_url ? '✅' : '❌'}`);
        if (data.type === 'video') {
          console.log(`   - URL vidéo: ${data.video_url ? '✅' : '❌'}`);
        }
        console.log('---');
      });
    }

  } catch (error) {
    console.error('❌ Erreur lors du test Firestore:', error);
    console.error('Détails:', error.message);
  }
}

testFirestore();
