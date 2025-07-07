import React, { useEffect, useState } from 'react';
import { Star, Quote, Plus, X, ThumbsUp, Share2 } from 'lucide-react';
import { useAppState } from '../store/AppContext';
import { validateData, validateArray, validateTestimonial } from '../utils/dataValidation';
import siteConfig from '../config';
import DataError from './DataError';
import EmptyState from './EmptyState';

// Import sécurisé avec gestion d'erreur complète
let testimonialsData: any = {};
try {
  testimonialsData = require('../data/testimonials.json');
} catch (error) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('Impossible de charger testimonials.json:', error);
  }
  testimonialsData = { testimonials: [] };
}

interface Testimonial {
  id: string;
  name: string;
  event: string;
  rating: number;
  comment: string;
  visible: boolean;
  date: string;
}

const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [likedTestimonials, setLikedTestimonials] = useState<Set<string>>(new Set());
  const [hasError, setHasError] = useState(false);
  const { state, toggleTestimonialForm } = useAppState();

  // Déstructuration sécurisée avec validation complète
  const { testimonials = [] } = testimonialsData || {};
  
  // Validation robuste des données
  const validTestimonials = validateArray(testimonials)
    ? testimonials.filter((testimonial): testimonial is Testimonial => {
        const isValid = validateTestimonial(testimonial) && testimonial.visible === true;
        if (process.env.NODE_ENV === 'development' && !isValid) {
          console.warn('Invalid testimonial data:', testimonial);
        }
        return isValid;
      })
    : [];

  const visibleTestimonials = validTestimonials.filter(t => t.visible);

  // Validation runtime en développement
  if (process.env.NODE_ENV === 'development') {
    console.assert(typeof testimonialsData === 'object', 'testimonialsData should be valid object');
    console.assert(Array.isArray(testimonials), 'testimonials should be valid array');
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

    const element = document.getElementById('testimonials');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (visibleTestimonials.length > 1) {
      const interval = setInterval(() => {
        setActiveTestimonial((prev) => (prev + 1) % visibleTestimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [visibleTestimonials.length]);

  const handleRetry = () => {
    setHasError(false);
    window.location.reload();
  };

  const handleRetry = () => {
    setHasError(false);
    window.location.reload();
  };

  const renderStars = (rating: number) => {
    const safeRating = typeof rating === 'number' && rating >= 0 && rating <= 5 ? Math.floor(rating) : 5;
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < safeRating ? 'text-gold fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  // Fonction de recommandation
  const handleRecommend = (testimonialId: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('👍 Recommandation pour le témoignage:', testimonialId);
    }
    
    setLikedTestimonials(prev => {
      const newSet = new Set(prev);
      if (newSet.has(testimonialId)) {
        newSet.delete(testimonialId);
      } else {
        newSet.add(testimonialId);
      }
      return newSet;
    });
  };

  // Fonction de partage WhatsApp
  const handleShareTestimonial = (testimonial: Testimonial) => {
    try {
      if (typeof window === 'undefined') return;
      
      const { brand } = siteConfig;
      const message = `Découvrez ce témoignage sur ${brand.name} : "${testimonial.comment}" - ${testimonial.name}`;
      const currentUrl = window.location.href;
      
      if (!currentUrl || typeof currentUrl !== 'string') {
        throw new Error('URL invalide');
      }
      
      const encodedMessage = encodeURIComponent(message);
      const encodedUrl = encodeURIComponent(currentUrl);
      const whatsappUrl = `https://wa.me/?text=${encodedMessage} ${encodedUrl}`;
      
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📤 Partage WhatsApp initié pour le témoignage de:', testimonial.name);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Erreur lors du partage WhatsApp:', error);
      }
    }
  };

  // Gestion d'erreur
  if (hasError) {
    return (
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <DataError 
            message="Impossible de charger les témoignages"
            retry={handleRetry}
          />
        </div>
      </section>
    );
  }

  // Gestion d'erreur
  if (hasError) {
    return (
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <DataError 
            message="Impossible de charger les témoignages"
            retry={handleRetry}
          />
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-4 transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Témoignages
          </h2>
          <p className={`text-xl text-gray-600 max-w-3xl mx-auto transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
            Ils nous ont fait confiance pour leurs événements d'exception
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {visibleTestimonials.length > 0 ? (
            <div className={`transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="relative bg-gray-50 rounded-3xl p-8 md:p-12 mb-8">
                <Quote className="absolute top-6 left-6 w-8 h-8 text-gold opacity-50" />
                
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {renderStars(visibleTestimonials[activeTestimonial]?.rating || 5)}
                  </div>
                  
                  <blockquote className="text-lg md:text-xl text-gray-700 mb-6 italic leading-relaxed">
                    "{visibleTestimonials[activeTestimonial]?.comment || 'Témoignage non disponible.'}"
                  </blockquote>
                  
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">
                      {visibleTestimonials[activeTestimonial]?.name || 'Client'}
                    </p>
                    <p className="text-gold text-sm">
                      {visibleTestimonials[activeTestimonial]?.event || 'Événement'}
                    </p>
                    
                    {/* Boutons d'interaction */}
                    <div className="flex items-center justify-center space-x-4 mt-6">
                      <button
                        onClick={() => handleRecommend(visibleTestimonials[activeTestimonial]?.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                          likedTestimonials.has(visibleTestimonials[activeTestimonial]?.id)
                            ? 'bg-gold text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {likedTestimonials.has(visibleTestimonials[activeTestimonial]?.id) 
                            ? 'Recommandé !' 
                            : 'Je recommande'
                          }
                        </span>
                      </button>
                      
                      <button
                        onClick={() => handleShareTestimonial(visibleTestimonials[activeTestimonial])}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-300"
                      >
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Partager</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pagination dots */}
              {visibleTestimonials.length > 1 && (
                <div className="flex justify-center space-x-2 mb-8">
                  {visibleTestimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === activeTestimonial ? 'bg-gold' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <EmptyState 
                title="Témoignages bientôt disponibles"
                message="Les témoignages de nos clients seront affichés ici prochainement."
                icon={Quote}
              />
              <button
                onClick={toggleTestimonialForm}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gold to-gold-light text-white rounded-full hover:shadow-gold transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Laisser un témoignage
              </button>
            </div>
          )}

          {/* Testimonial form modal */}
          {state.showTestimonialForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Votre témoignage</h3>
                  <button
                    onClick={toggleTestimonialForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Votre nom
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="Votre nom complet"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type d'événement
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="Mariage, Corporate, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Votre commentaire
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="Partagez votre expérience..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-gold to-gold-light text-white py-3 rounded-lg hover:shadow-gold transition-all duration-300"
                  >
                    Envoyer le témoignage
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;