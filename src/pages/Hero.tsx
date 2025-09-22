import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 z-0">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="videos/video.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>

      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/cover.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
>>>>>>> a5f1271d6acb73901a6aa69c838ba1961a7b8ad5
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in">
            <span className="block">Transformez Votre Corps.</span>
            <span className="block">Élevez Vos Performances.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl animate-fade-in-delay">
            Un coaching sportif personnalisé pour vous aider à atteindre votre plein potentiel, que vous soyez débutant ou athlète confirmé.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-delay-2">
            <a 
              href="#services" 
              className="bg-red-600 text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-red-700 transition-colors duration-200 text-center"
            >
              Découvrir nos Services
            </a>
            <a 
              href="#contact" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-white hover:text-red-900 transition-colors duration-200 text-center"
            >
              Consultation Gratuite
            </a>
          </div>
        </div>
      </div>
      
      <button 
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce"
        aria-label="Défiler vers le bas"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
};

export default Hero;