import React, { useEffect, useState, memo } from 'react';
import { Crown, Heart, Sparkles } from 'lucide-react';
import { validateData, validateArray } from '../utils/dataValidation';
import DataError from './DataError';
import EmptyState from './EmptyState';

// Import sécurisé avec gestion d'erreur
let contentData: any = {};
try {
  contentData = require('../data/content.json');
} catch (error) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('Impossible de charger content.json:', error);
  }
  contentData = {
    about: {
      title: "Notre Excellence",
      description: "Informations bientôt disponibles.",
      values: []
    }
  };
}

const About = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Validation et déstructuration sécurisée
  const { about = {} } = contentData || {};
  const {
    title = "Notre Excellence",
    description = "Informations bientôt disponibles.",
    values = []
  } = about || {};

  // Validation des données
  const validValues = validateArray(values) 
    ? values.filter(value => 
        validateData(value) &&
        typeof value.icon === 'string' &&
        typeof value.title === 'string' &&
        typeof value.description === 'string'
      )
    : [];

  // Validation runtime en développement
  if (process.env.NODE_ENV === 'development') {
    console.assert(typeof contentData === 'object', 'contentData should be valid object');
    console.assert(typeof about === 'object', 'about section should be valid object');
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('about');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const handleRetry = () => {
    setHasError(false);
    window.location.reload();
  };

  // Gestion d'erreur
  if (hasError) {
    return (
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <DataError 
            message="Impossible de charger les informations de la section À propos"
            retry={handleRetry}
          />
        </div>
      </section>
    );
  }

  const iconMap = {
    Crown,
    Heart,
    Sparkles
  };

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {title || 'Notre Excellence'}
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              {description || 'Informations bientôt disponibles.'}
            </p>
            
            {validValues.length > 0 ? (
              <div className="space-y-6">
                {validValues.map((value, index) => {
                  const IconComponent = iconMap[value.icon] || Sparkles;
                  return (
                    <div 
                      key={index}
                      className={`flex items-start space-x-4 transform transition-all duration-700 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                      }`}
                      style={{ transitionDelay: `${index * 200}ms` }}
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {value.title || 'Valeur'}
                        </h3>
                        <p className="text-gray-600">
                          {value.description || 'Description non disponible.'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState 
                title="Valeurs en cours de mise à jour"
                message="Nos valeurs et notre approche seront bientôt détaillées ici."
                icon={Heart}
              />
            )}
          </div>

          {/* Image */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Isaac & Alyam - Exclusive Events"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center shadow-gold">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

About.displayName = 'About';

export default About;