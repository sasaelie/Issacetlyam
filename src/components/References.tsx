import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, Plus } from 'lucide-react';
import { validateData, validateArray, validateReference } from '../utils/dataValidation';
import DataError from './DataError';
import EmptyState from './EmptyState';

// Import sécurisé avec gestion d'erreur complète
let referencesData: any = {};
try {
  referencesData = require('../data/references.json');
} catch (error) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('Impossible de charger references.json:', error);
  }
  referencesData = { references: [] };
}

interface Reference {
  id: string;
  name: string;
  type: string;
  event: string;
  year: string;
  visible: boolean;
}

const References = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Déstructuration sécurisée avec validation complète
  const { references = [] } = referencesData || {};
  
  // Validation robuste des données
  const validReferences = validateArray(references)
    ? references.filter((reference): reference is Reference => {
        const isValid = validateReference(reference);
        if (process.env.NODE_ENV === 'development' && !isValid) {
          console.warn('Invalid reference data:', reference);
        }
        return isValid;
      })
    : [];

  const visibleReferences = validReferences.filter(ref => ref.visible);

  // Validation runtime en développement
  if (process.env.NODE_ENV === 'development') {
    console.assert(typeof referencesData === 'object', 'referencesData should be valid object');
    console.assert(Array.isArray(references), 'references should be valid array');
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

    const element = document.getElementById('references');
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
      <section id="references" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <DataError 
            message="Impossible de charger les références"
            retry={handleRetry}
          />
        </div>
      </section>
    );
  }

  return (
    <section id="references" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-4 transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Nos Références
          </h2>
          <p className={`text-xl text-gray-600 max-w-3xl mx-auto transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
            Lieux prestigieux et événements d'exception
          </p>
        </div>

        {visibleReferences.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {visibleReferences.map((reference, index) => (
              <div
                key={reference.id || `reference-${index}`}
                className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {reference.name || 'Référence'}
                  </h3>
                  
                  <p className="text-sm text-gold mb-2">
                    {reference.type || 'Type non spécifié'}
                  </p>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {reference.event || 'Événement non spécifié'}
                  </p>
                  
                  <div className="flex items-center justify-center text-xs text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {reference.year || 'Année non spécifiée'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-12">
            <EmptyState 
              title="Références bientôt disponibles"
              message="Nos références et partenariats seront affichés ici prochainement."
              icon={MapPin}
            />
          </div>
        )}

        {/* Add reference CTA */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Souhaitez-vous être cité comme référence ?
            </h3>
            <p className="text-gray-600 mb-6">
              Si vous avez organisé un événement avec nous et souhaitez apparaître dans nos références, 
              nous serions ravis de vous ajouter à notre liste.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gold to-gold-light text-white rounded-full hover:shadow-gold transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Devenir une référence
            </button>
          </div>
        </div>

        {/* Add reference form modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Nouvelle référence</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du lieu/client
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Ex: Château de Versailles"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de lieu
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Ex: Lieu prestigieux"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'événement
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Ex: Gala de charité"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Année
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="2024"
                  />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default References;