import React from 'react';
import { Dumbbell, Users, Trophy, Apple } from 'lucide-react';
import { services } from '../data';

const iconMap: Record<string, React.ReactNode> = {
  Dumbbell: <Dumbbell className="h-10 w-10 text-red-600" />,
  Users: <Users className="h-10 w-10 text-red-600" />,
  Trophy: <Trophy className="h-10 w-10 text-red-600" />,
  Apple: <Apple className="h-10 w-10 text-red-600" />,
};

const Services: React.FC = () => {
  return (
    <section id="services">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nos Services</h2>
          <div className="w-20 h-1 bg-red-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600">
            Des programmes complets de fitness et de performance adaptés à vos objectifs et besoins spécifiques.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div 
              key={service.id}
              className="bg-gray-50 rounded-xl p-8 shadow-sm transition-all duration-300 hover:shadow-xl border-t-4 border-red-600"
            >
              <div className="mb-6">
                {iconMap[service.icon]}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              
              <ul className="space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="h-2 w-2 bg-red-600 rounded-full mr-3"></span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <a 
                  href="#contact" 
                  className="inline-flex items-center text-red-600 font-medium hover:text-red-800 transition-colors duration-200"
                >
                  En savoir plus
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <a 
            href="#contact" 
            className="inline-block bg-red-600 text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-red-700 transition-colors duration-200"
          >
            Réserver Votre Première Séance
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;