import React from 'react';
import Hero from './Hero';
import { Dumbbell, Users, Apple, Trophy, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { testimonials } from '../data';

// Fonction pour remonter en haut de la page
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const services = [
  {
    icon: <Dumbbell className="h-8 w-8 text-red-500" />,
    title: 'Coaching Personnel',
    description: 'Programmes sur mesure adaptés à vos objectifs spécifiques',
    link: '/services#personal'
  },
  {
    icon: <Users className="h-8 w-8 text-red-500" />,
    title: 'Cours Collectifs',
    description: 'Entraînements en groupe dynamiques et motivants',
    link: '/services#group'
  },
  {
    icon: <Apple className="h-8 w-8 text-red-500" />,
    title: 'Nutrition Sportive',
    description: 'Plans alimentaires personnalisés pour optimiser vos résultats',
    link: '/services#nutrition'
  },
  {
    icon: <Trophy className="h-8 w-8 text-red-500" />,
    title: 'Préparation Physique',
    description: 'Programmes spécialisés pour athlètes et compétiteurs',
    link: '/services#preparation'
  }
];

const stats = [
  { number: '500+', label: 'Clients Satisfaits' },
  { number: '10+', label: 'Années d\'Expérience' },
  { number: '98%', label: 'Taux de Réussite' },
  { number: '50+', label: 'Transformations' }
];

const transformationFeatures = [
  'Programmes adaptés à tous les niveaux',
  'Suivi nutritionnel personnalisé',
  'Support continu et motivation'
];

const HomePage = () => {
  const [activeTestimonialIndex, setActiveTestimonialIndex] = React.useState(0);

  const nextTestimonial = () => {
    setActiveTestimonialIndex((current) => 
      current === testimonials.length - 1 ? 0 : current + 1
    );
  };

  const prevTestimonial = () => {
    setActiveTestimonialIndex((current) => 
      current === 0 ? testimonials.length - 1 : current - 1
    );
  };

  return (
    <div className="w-full">
      <Hero />
      
      {/* Services Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-all duration-300">
                <div className="bg-red-100 rounded-lg w-10 h-10 flex items-center justify-center mb-3">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                <Link 
                  to={service.link}
                  className="text-red-600 hover:text-red-700 flex items-center group text-sm"
                >
                  En savoir plus 
                  <span className="ml-1 transform transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-2xl font-bold text-red-400 mb-1">{stat.number}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transformation Guarantee Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <img 
                src="images/cov.jpg"
                alt="Transformation fitness"
                className="rounded-lg shadow-xl object-cover w-full h-[400px]"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Transformation Garantie</h2>
              <p className="text-gray-600 mb-6">
                Découvrez comment nos programmes personnalisés peuvent vous aider à atteindre vos
                objectifs fitness. Que vous souhaitiez perdre du poids, gagner en muscle ou améliorer vos
                performances, nous avons le programme qu'il vous faut.
              </p>
              <ul className="space-y-3 mb-6">
                {transformationFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="h-2 w-2 bg-red-500 rounded-full mr-3"></span>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm"
              >
                Commencer Maintenant
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Témoignages</h2>
            <p className="text-gray-300">
              Découvrez les histoires de réussite de nos clients
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeTestimonialIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                    <div className="bg-gray-800 rounded-lg p-6">
                      <div className="flex items-center space-x-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-base italic text-gray-300 mb-6">
                        "{testimonial.content}"
                      </blockquote>
                      <div className="flex items-center">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="h-10 w-10 rounded-full object-cover mr-3"
                        />
                        <div>
                          <p className="font-semibold text-sm">{testimonial.name}</p>
                          <p className="text-red-400 text-xs">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={prevTestimonial}
              className="absolute top-1/2 -left-3 transform -translate-y-1/2 bg-red-600 rounded-full p-1.5 hover:bg-red-700 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-red-600 rounded-full p-1.5 hover:bg-red-700 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-blue-900 to-red-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Prêt à Transformer Votre Corps ?
          </h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Rejoignez BBP Performance et commencez votre voyage vers une meilleure version de vous-même. Premier cours d'essai gratuit !
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 text-sm"
            onClick={scrollToTop}
          >
            Réserver une Séance
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;