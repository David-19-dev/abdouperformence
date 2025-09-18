import React from 'react';
import { Check } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
  benefits: string[];
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  price,
  duration,
  features,
  benefits
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="bg-red-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="mb-6">
          <span className="text-3xl font-bold text-red-600">{price}</span>
          <span className="text-gray-500 ml-2">{duration}</span>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Inclus :</h4>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Bénéfices :</h4>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center text-sm">
                  <Check size={16} className="text-red-500 mr-2 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-gray-50 border-t">
        <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200">
          Réserver Maintenant
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;