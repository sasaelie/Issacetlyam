import React, { useEffect, useState, memo } from 'react';
import { Building, Heart, Users, Diamond, ArrowRight } from 'lucide-react';

// Import avec gestion d'erreur
let servicesData: { services?: any[] } = {};
try {
  servicesData = require('../data/services.json');
} catch (error) {
  console.warn('Impossible de charger services.json:', error);
  servicesData = { services: [] };
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  features: string[];
}

const Services = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Déstructuration sécurisée avec fallback
  const { services = [] } = servicesData || {};
  
  // Validation des données
  const validServices = Array.isArray(services) 
    ? services.filter((service): service is Service => {
        return service && 
               typeof service.id === 'string' &&
               typeof service.title === 'string' &&
               typeof service.description === 'string' &&
               typeof service.icon === 'string' &&
               typeof service.image === 'string' &&
               Array.isArray(service.features);
      })
    : [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('services');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const iconMap: Record<string, React.ComponentType<any>> = {
    Heart,
    Building,
    Users,
    Diamond
  };

  // Fallback si aucun service valide
  if (!validServices.length) {
    return (
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nos Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Nos services seront bientôt disponibles. Contactez-nous pour plus d'informations.
            </p>
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
              <p className="text-gray-600">
                Aucun service disponible actuellement. Veuillez nous contacter directement pour découvrir notre offre complète.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-4 transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Nos Services
          </h2>
          <p className={`text-xl text-gray-600 max-w-3xl mx-auto transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
            Découvrez notre expertise dans l'organisation d'événements d'exception
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {validServices.map((service, index) => {
            // Protection supplémentaire pour chaque service
            const IconComponent = iconMap[service.icon] || Building;
            const serviceFeatures = Array.isArray(service.features) ? service.features : [];
            
            return (
              <div
                key={service.id || `service-${index}`}
                className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:scale-105 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={service.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='} 
                    alt={service.title || 'Service'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {service.title || 'Service'}
                    </h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description || 'Description du service non disponible.'}
                  </p>
                  
                  {serviceFeatures.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {serviceFeatures.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center text-gold group-hover:text-gold-dark transition-colors">
                    <span className="text-sm font-medium">En savoir plus</span>
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

Services.displayName = 'Services';

export default Services;