import React from 'react';
import { Award, Users, Clock, CheckCircle, Medal, Book, Target, Heart } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20">
      {/* Hero Section */}
      <div className="relative h-[400px] mb-20">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-red-800/90" />
        </div>
        <div className="container mx-auto px-4 md:px-6 h-full">
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Votre Coach Personnel au Sénégal</h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Passionné par le fitness et dédié à votre transformation
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Personal Introduction */}
        <div className="flex flex-col md:flex-row gap-12 items-center mb-20">
          <div className="w-full md:w-1/2 relative">
            <div className="relative z-10">
              <img 
                src="https://images.pexels.com/photos/4498294/pexels-photo-4498294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Coach de fitness" 
                className="rounded-lg shadow-xl object-cover w-full h-[600px]"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-red-600 text-white p-6 rounded-lg shadow-lg md:max-w-xs">
              <div className="flex items-center mb-2">
                <Award size={24} className="mr-2" />
                <h3 className="text-xl font-bold">Coach Certifié</h3>
              </div>
              <p className="text-white/90">
                Plus de 10 ans d'expérience dans le coaching sportif et la transformation physique
              </p>
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <span className="text-red-600 font-semibold uppercase tracking-wider">Mon Histoire</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
              Une Passion Pour Le Fitness Et La Transformation
            </h2>
            <p className="text-gray-600 mb-6">
              Depuis mon plus jeune âge, j'ai toujours été passionné par le sport et le bien-être. 
              Cette passion m'a naturellement conduit vers le coaching sportif, où je peux aider les 
              autres à atteindre leurs objectifs et à transformer leur vie.
            </p>
            <p className="text-gray-600 mb-8">
              Basé à Dakar, je me suis spécialisé dans la musculation et la transformation physique, 
              aidant des centaines de clients à atteindre leurs objectifs, qu'il s'agisse de perte 
              de poids, de gain musculaire ou d'amélioration de leurs performances.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-red-600 mb-1">500+</div>
                <div className="text-gray-600">Clients Satisfaits</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-red-600 mb-1">10+</div>
                <div className="text-gray-600">Années d'Expérience</div>
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-red-600 font-semibold uppercase tracking-wider">Ma Philosophie</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">Une Approche Holistique du Fitness</h2>
            <p className="text-gray-600">
              Je crois en une approche équilibrée qui combine entraînement, nutrition et bien-être mental 
              pour des résultats durables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Target className="text-red-600" size={32} />,
                title: "Objectifs Personnalisés",
                description: "Chaque programme est adapté à vos objectifs spécifiques"
              },
              {
                icon: <Heart className="text-red-600" size={32} />,
                title: "Bien-être Global",
                description: "Focus sur la santé physique et mentale"
              },
              {
                icon: <Book className="text-red-600" size={32} />,
                title: "Éducation Continue",
                description: "Apprentissage des bonnes pratiques pour l'autonomie"
              },
              {
                icon: <Users className="text-red-600" size={32} />,
                title: "Support Constant",
                description: "Accompagnement et motivation tout au long du parcours"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications Section */}
        <div className="bg-gray-50 rounded-2xl p-12 mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-red-600 font-semibold uppercase tracking-wider">Certifications</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">Expertise Reconnue</h2>
            <p className="text-gray-600">
              Une formation continue pour vous offrir le meilleur accompagnement possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Certifications Professionnelles",
                items: [
                  "Diplôme d'État en Coaching Sportif",
                  "Certification en Nutrition Sportive",
                  "Spécialisation en Musculation et Haltérophilie",
                  "Formation en Premiers Secours"
                ]
              },
              {
                title: "Spécialisations",
                items: [
                  "Expert en Transformation Physique",
                  "Préparation aux Compétitions",
                  "Réhabilitation Post-Blessure",
                  "Programme Perte de Poids"
                ]
              }
            ].map((section, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-6">{section.title}</h3>
                <ul className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center">
                      <Medal size={20} className="text-red-600 mr-3" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-900 to-red-800 text-white rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à Commencer Votre Transformation ?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez-moi pour un programme personnalisé qui vous permettra d'atteindre vos objectifs.
          </p>
          <button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-lg transition-all font-semibold">
            Réserver une Consultation Gratuite
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;