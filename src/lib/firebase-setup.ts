import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from './firebase';

// Configuration initiale de Firebase
export const setupFirebaseCollections = async () => {
  try {
    console.log('🔥 Configuration des collections Firebase...');

    // Créer l'utilisateur admin
    const adminEmail = 'admin@bambaperformance.com';
    const adminPassword = '!*$Root-1!*$';

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      const user = userCredential.user;

      // Créer le profil admin dans Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: adminEmail,
        role: 'admin',
        full_name: 'Administrateur BBP',
        created_at: new Date()
      });

      console.log('✅ Utilisateur admin créé avec succès');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('ℹ️ Utilisateur admin existe déjà');
      } else {
        console.error('❌ Erreur création admin:', error);
      }
    }

    // Créer des exemples de données
    await createSampleData();

    console.log('✅ Configuration Firebase terminée');
    return true;
  } catch (error) {
    console.error('❌ Erreur configuration Firebase:', error);
    return false;
  }
};

const createSampleData = async () => {
  try {
    // Exemple de produits
    const sampleProducts = [
      {
        name: 'Whey Protein Premium',
        description: 'Protéine de lactosérum de haute qualité pour la récupération musculaire',
        price: 45000,
        category: 'Protéines',
        stock: 25,
        image_url: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=600',
        featured: true,
        created_at: new Date()
      },
      {
        name: 'BCAA Energy',
        description: 'Acides aminés essentiels pour l\'énergie et la récupération',
        price: 35000,
        category: 'Acides Aminés',
        stock: 30,
        image_url: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=600',
        featured: false,
        created_at: new Date()
      },
      {
        name: 'Pre-Workout Boost',
        description: 'Booster pré-entraînement pour des performances maximales',
        price: 40000,
        category: 'Pré-workout',
        stock: 20,
        image_url: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=600',
        featured: true,
        created_at: new Date()
      }
    ];

    // Ajouter les produits
    for (const product of sampleProducts) {
      await addDoc(collection(db, 'products'), product);
    }

    // Exemple d'articles de blog
    const sampleBlogPosts = [
      {
        title: 'Comment optimiser sa récupération musculaire',
        excerpt: 'Découvrez les meilleures techniques pour récupérer efficacement après vos séances d\'entraînement intensif.',
        content: 'Contenu complet de l\'article sur la récupération musculaire...',
        image_url: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Récupération',
        author: 'Coach Ibrahim',
        published_at: new Date(),
        read_time: '5 min',
        featured: true,
        slug: 'recuperation-musculaire',
        created_at: new Date()
      },
      {
        title: 'Les bases d\'une nutrition pré et post-entraînement',
        excerpt: 'Tout ce que vous devez savoir sur l\'alimentation avant et après votre séance pour maximiser vos résultats.',
        content: 'Contenu complet de l\'article sur la nutrition...',
        image_url: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Nutrition',
        author: 'Coach Ibrahim',
        published_at: new Date(),
        read_time: '8 min',
        featured: true,
        slug: 'nutrition-pre-post-entrainement',
        created_at: new Date()
      }
    ];

    // Ajouter les articles
    for (const post of sampleBlogPosts) {
      await addDoc(collection(db, 'blog_posts'), post);
    }

    // Exemple de vidéos
    const sampleVideos = [
      {
        title: 'Technique parfaite du squat',
        description: 'Apprenez la technique correcte du squat pour éviter les blessures et maximiser les résultats',
        video_url: 'https://www.youtube.com/watch?v=example1',
        thumbnail_url: 'https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Technique',
        author: 'Coach Ibrahim',
        duration: '8:30',
        featured: true,
        published_at: new Date(),
        created_at: new Date()
      },
      {
        title: 'Échauffement complet avant musculation',
        description: 'Routine d\'échauffement essentielle avant chaque séance de musculation',
        video_url: 'https://www.youtube.com/watch?v=example2',
        thumbnail_url: 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Échauffement',
        author: 'Coach Ibrahim',
        duration: '12:15',
        featured: false,
        published_at: new Date(),
        created_at: new Date()
      }
    ];

    // Ajouter les vidéos
    for (const video of sampleVideos) {
      await addDoc(collection(db, 'videos'), video);
    }

    console.log('✅ Données d\'exemple créées');
  } catch (error) {
    console.error('❌ Erreur création données d\'exemple:', error);
  }
};

// Fonction pour vérifier la configuration
export const checkFirebaseSetup = async () => {
  try {
    // Vérifier la connexion à Firestore
    const testDoc = doc(db, 'test', 'connection');
    await setDoc(testDoc, { timestamp: new Date() });
    
    console.log('✅ Connexion Firebase OK');
    return true;
  } catch (error) {
    console.error('❌ Erreur connexion Firebase:', error);
    return false;
  }
};