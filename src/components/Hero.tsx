import React, { useEffect, useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import siteConfig from '../config';
import DataError from './DataError';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Utilisation de la configuration centralisée
  const { brand, meta } = siteConfig;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRetry = () => {
    setHasError(false);
    window.location.reload();
  };

  // Gestion d'erreur
  if (hasError) {
    return (
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 marble-texture"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <DataError 
            message="Impossible de charger la section d'accueil"
            retry={handleRetry}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Marble background */}
      <div className="absolute inset-0 marble-texture"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(typeof window !== 'undefined' && window.innerWidth < 768 ? 10 : 20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className={`transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="text-gold mr-3 w-8 h-8" />
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight">
              {brand.name}
            </h1>
            <Sparkles className="text-gold ml-3 w-8 h-8" />
          </div>
          
          <h2 className="text-2xl md:text-3xl text-gold font-light mb-4 tracking-wide">
            {brand.subtitle}
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-3 font-light italic">
            {brand.slogan}
          </p>
          
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            {meta.description}
          </p>
          
          <button
            onClick={scrollToAbout}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gold to-gold-light text-white text-lg font-medium rounded-full hover:shadow-gold transition-all duration-300 transform hover:scale-105"
          >
            Prendre contact
            <ChevronDown className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="text-gold w-8 h-8 opacity-70" />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </section>
  );
};

export default Hero;