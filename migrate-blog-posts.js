import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBFEApsjCdy_t-_WFrxf-vRX96XQmvmW08",
  authDomain: "bbp-performence.firebaseapp.com",
  projectId: "bbp-performence",
  storageBucket: "bbp-performence.firebasestorage.app",
  messagingSenderId: "78469752392",
  appId: "1:78469752392:web:e5c36dffdf2553359a1a7d",
  measurementId: "G-3J4JBVM0PF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Static articles from the original Blog component
const staticArticles = [
  {
    title: "Comment optimiser sa récupération musculaire",
    excerpt: "Découvrez les meilleures techniques pour récupérer efficacement après vos séances d'entraînement intensif.",
    imageUrl: "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Récupération",
    author: "Coach Ibrahim",
    publishedAt: Timestamp.fromDate(new Date("2024-03-15")),
    readTime: "5 min",
    featured: true,
    slug: "recuperation-musculaire",
    content: "Contenu détaillé sur l'optimisation de la récupération musculaire..."
  },
  {
    title: "Les bases d'une nutrition pré et post-entraînement",
    excerpt: "Tout ce que vous devez savoir sur l'alimentation avant et après votre séance pour maximiser vos résultats.",
    imageUrl: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Nutrition",
    author: "Coach Ibrahim",
    publishedAt: Timestamp.fromDate(new Date("2024-03-10")),
    readTime: "8 min",
    featured: true,
    slug: "nutrition-pre-post-entrainement",
    content: "Contenu détaillé sur la nutrition pré et post-entraînement..."
  },
  {
    title: "Guide complet des exercices de musculation",
    excerpt: "Un guide détaillé des exercices fondamentaux pour chaque groupe musculaire.",
    imageUrl: "https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Musculation",
    author: "Coach Ibrahim",
    publishedAt: Timestamp.fromDate(new Date("2024-03-05")),
    readTime: "12 min",
    featured: false,
    slug: "guide-exercices-musculation",
    content: "Contenu détaillé du guide complet des exercices de musculation..."
  },
  {
    title: "Les mythes de la perte de poids",
    excerpt: "Démystifions ensemble les croyances les plus communes sur la perte de poids.",
    imageUrl: "https://images.pexels.com/photos/4098228/pexels-photo-4098228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Perte de poids",
    author: "Coach Ibrahim",
    publishedAt: Timestamp.fromDate(new Date("2024-03-01")),
    readTime: "6 min",
    featured: false,
    slug: "mythes-perte-de-poids",
    content: "Contenu détaillé sur les mythes de la perte de poids..."
  },
  {
    title: "S'entraîner pendant le Ramadan",
    excerpt: "Conseils pratiques pour maintenir votre routine fitness pendant le mois sacré.",
    imageUrl: "https://images.pexels.com/photos/4162583/pexels-photo-4162583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Conseils",
    author: "Coach Ibrahim",
    publishedAt: Timestamp.fromDate(new Date("2024-02-25")),
    readTime: "7 min",
    featured: false,
    slug: "entrainement-ramadan",
    content: "Contenu détaillé sur l'entraînement pendant le Ramadan..."
  },
  {
    title: "Les bienfaits de l'entraînement en plein air",
    excerpt: "Découvrez pourquoi s'entraîner en extérieur peut booster vos résultats.",
    imageUrl: "https://images.pexels.com/photos/2294354/pexels-photo-2294354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Lifestyle",
    author: "Coach Ibrahim",
    publishedAt: Timestamp.fromDate(new Date("2024-02-20")),
    readTime: "5 min",
    featured: false,
    slug: "entrainement-plein-air",
    content: "Contenu détaillé sur les bienfaits de l'entraînement en plein air..."
  }
];

async function migrateArticles() {
  console.log('🚀 Début de la migration des articles...');

  try {
    for (const article of staticArticles) {
      const now = Timestamp.now();
      await addDoc(collection(db, 'blog_posts'), {
        ...article,
        createdAt: now,
        updatedAt: now
      });
      console.log(`✅ Article ajouté: ${article.title}`);
    }

    console.log('🎉 Migration terminée avec succès!');
    console.log(`📊 ${staticArticles.length} articles migrés vers Firestore`);

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  }
}

// Exécuter la migration
migrateArticles();
