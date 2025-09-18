import React from 'react';
import { Dumbbell, Users, Salad, Medal, Clock, CheckCircle, Target, ArrowRight } from 'lucide-react';
import ServiceCard from './ServiceCard';

const services = [
  {
    icon: <Dumbbell size={24} />,
    title: "Coaching Personnel",
    description: "Programme d'entraînement sur mesure avec suivi personnalisé pour atteindre vos objectifs de manière efficace et durable.",
    price: "50,000 FCFA",
    duration: "Par mois",
    features: [
      "4 séances par semaine",
      "Programme personnalisé",
      "Suivi nutritionnel",
      "Support WhatsApp 7j/7",
      "Bilan mensuel",
      "Accès à l'application de suivi"
    ],
    benefits: [
      "Résultats rapides et durables",
      "Technique parfaite garantie",
      "Motivation constante",
      "Programme adapté à votre niveau"
    ]
  },
  {
    icon: <Users size={24} />,
    title: "Cours Collectifs",
    description: "Séances de groupe dynamiques et motivantes pour progresser ensemble dans une ambiance conviviale.",
    price: "30,000 FCFA",
    duration: "Par mois",
    features: [
      "3 séances par semaine",
      "Groupes de 5-8 personnes",
      "Programmes variés",
      "Suivi des progrès",
      "Ambiance motivante",
      "Horaires flexibles"
    ],
    benefits: [
      "Motivation de groupe",
      "Prix avantageux",
      "Émulation positive",
      "Convivialité garantie"
    ]
  },
  {
    icon: <Salad size={24} />,
    title: "Consultation Nutrition",
    description: "Plans nutritionnels personnalisés et coaching pour optimiser votre alimentation et maximiser vos résultats.",
    price: "25,000 FCFA",
    duration: "Par consultation",
    features: [
      "Bilan nutritionnel complet",
      "Plan alimentaire personnalisé",
      "Liste de courses",
      "Recettes adaptées",
      "Suivi des progrès",
      "Ajustements réguliers"
    ],
    benefits: [
      "Perte de poids durable",
      "Gain musculaire optimisé",
      "Énergie augmentée",
      "Habitudes alimentaires saines"
    ]
  },
  {
    icon: <Medal size={24} />,
    title: "Préparation Compétition",
    description: "Programme spécialisé pour les athlètes visant une compétition de bodybuilding ou de fitness.",
    price: "75,000 FCFA",
    duration: "Par mois",
    features: [
      "5 séances par semaine",
      "Nutrition périodisée",
      "Pose practice",
      "Suivi hebdomadaire",
      "Plan compétition détaillé",
      "Support 24/7"
    ],
    benefits: [
      "Préparation optimale",
      "Expertise spécialisée",
      "Suivi rapproché",
      "Performance maximale"
    ]
  }
];

const Services = () => {
  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-red-600 font-semibold uppercase tracking-wider">Nos Services</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">Des Programmes Adaptés à Vos Objectifs</h2>
          <p className="text-gray-600">
            Découvrez nos services de coaching personnalisés pour vous aider à atteindre vos objectifs fitness,
            que vous soyez débutant ou athlète confirmé.
          </p>
        </div>

        {/* Featured Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-blue-900 text-white p-8 rounded-lg text-center">
            <Clock size={32} className="mx-auto mb-4 text-red-400" />
            <h3 className="text-xl font-semibold mb-2">Flexibilité Horaire</h3>
            <p className="text-blue-100">Séances adaptées à votre emploi du temps, 7j/7</p>
          </div>
          <div className="bg-blue-900 text-white p-8 rounded-lg text-center">
            <Target size={32} className="mx-auto mb-4 text-red-400" />
            <h3 className="text-xl font-semibold mb-2">Objectifs Personnalisés</h3>
            <p className="text-blue-100">Programmes sur mesure selon vos besoins</p>
          </div>
          <div className="bg-blue-900 text-white p-8 rounded-lg text-center">
            <CheckCircle size={32} className="mx-auto mb-4 text-red-400" />
            <h3 className="text-xl font-semibold mb-2">Résultats Garantis</h3>
            <p className="text-blue-100">Suivi régulier et ajustements continus</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              price={service.price}
              duration={service.duration}
              features={service.features}
              benefits={service.benefits}
            />
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-900 to-red-800 rounded-2xl p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Prêt à Commencer Votre Transformation ?</h3>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Réservez une consultation gratuite pour discuter de vos objectifs et découvrir le programme qui vous convient le mieux.
          </p>
          <button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-lg transition-all font-semibold inline-flex items-center">
            Réserver une Consultation
            <ArrowRight size={20} className="ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;