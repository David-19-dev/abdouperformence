import { NavItem, Service, GalleryImage, Testimonial } from '../types';

export const navItems: NavItem[] = [
  { name: 'Accueil', href: '/' },
  { name: 'À propos', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Blog', href: '/blog' },
  { name: 'Boutique', href: '/shop' },
  { name: 'Contact', href: '/contact' },
];

export const services: Service[] = [
  {
    id: 1,
    title: 'Coaching Personnel',
    description: 'Séances d\'entraînement personnalisées conçues pour répondre à vos objectifs spécifiques.',
    icon: 'Dumbbell',
    features: [
      'Évaluation physique initiale',
      'Plans d\'entraînement sur mesure',
      'Conseils nutritionnels',
      'Suivi des progrès',
      'Horaires flexibles',
    ],
  },
  {
    id: 2,
    title: 'Cours Collectifs',
    description: 'Entraînements en groupe dynamiques combinant force, cardio et exercices fonctionnels.',
    icon: 'Users',
    features: [
      'Groupes limités',
      'Différents niveaux d\'intensité',
      'Soutien communautaire',
      'Sessions hebdomadaires',
      'Ambiance motivante',
    ],
  },
  {
    id: 3,
    title: 'Performance Sportive',
    description: 'Entraînement spécialisé pour les athlètes visant à améliorer leurs performances.',
    icon: 'Trophy',
    features: [
      'Conditionnement spécifique',
      'Entraînement vitesse et agilité',
      'Prévention des blessures',
      'Analyse des performances'
    ],
  },
  {
    id: 4,
    title: 'Coaching Nutrition',
    description: 'Plans nutritionnels complets adaptés à votre parcours fitness et votre santé globale.',
    icon: 'Apple',
    features: [
      'Plans repas personnalisés',
      'Analyse alimentaire',
      'Conseils en supplémentation',
      'Stratégies d\'hydratation'
    ],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Ibrahim Seck',
    role: 'Préparation compétition',
    image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600',
    content: "J'ai remporté ma première compétition de bodybuilding grâce à la préparation minutieuse et au suivi rigoureux. Un coach qui connaît parfaitement son métier.",
    rating: 5
  },
  {
    id: 2,
    name: 'Aminata Diallo',
    role: 'Perte de poids',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600',
    content: "-25kg en 8 mois de façon saine et durable. Le suivi nutritionnel et les séances adaptées ont fait toute la différence.",
    rating: 5
  },
  {
    id: 3,
    name: 'Moussa Faye',
    role: 'Remise en forme',
    image: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=600',
    content: "Les cours collectifs sont géniaux, l'ambiance est motivante et les résultats sont au rendez-vous. Je me sens en pleine forme !",
    rating: 5
  }
];