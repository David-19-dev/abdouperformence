import React from 'react';
import { Check } from 'lucide-react';
import { pricingPlans } from '../data';

const Pricing: React.FC = () => {
  return (
    <section id="pricing">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nos Forfaits</h2>
          <div className="w-20 h-1 bg-red-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600">
            Choisissez le forfait qui correspond à vos objectifs et à votre niveau d'engagement.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
                plan.popular 
                  ? 'shadow-xl scale-105 border-2 border-red-600 z-10' 
                  : 'shadow-lg hover:shadow-xl'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-1 text-sm font-semibold">
                  Le Plus Populaire
                </div>
              )}
              
              <div className="bg-white p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 ml-1">/mois</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <a
                  href="#contact"
                  className={`block text-center py-3 px-4 rounded-md font-medium transition-colors duration-200 ${
                    plan.popular
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="max-w-3xl mx-auto mt-16 bg-gray-50 rounded-xl p-8 shadow-sm text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Besoin d'un Forfait Personnalisé ?</h3>
          <p className="text-gray-600 mb-6">
            Nous pouvons créer un programme d'entraînement personnalisé adapté spécifiquement à vos besoins et objectifs uniques.
          </p>
          <a 
            href="#contact" 
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition-colors duration-200"
          >
            Contactez-nous pour des Options Personnalisées
          </a>
        </div>
      </div>
    </section>
  );
};

export default Pricing;