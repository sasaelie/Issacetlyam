import React, { useEffect, useState, useCallback } from 'react';
import { Send, CheckCircle, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';
import { useAppState } from '../store/AppContext';
import siteConfig from '../config';
import DataError from './DataError';

interface FormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  eventType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  general?: string;
}

const ContactForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { state, setFormSubmitting, setFormSubmitted } = useAppState();
  const [hasError, setHasError] = useState(false);
  
  // Utilisation de la configuration centralisée
  const { contact } = siteConfig;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    date: state.selectedDate || '',
    eventType: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('contact');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (state.selectedDate) {
      setFormData(prev => ({ ...prev, date: state.selectedDate || '' }));
    }
  }, [state.selectedDate]);

  // 🎯 ÉTAPE 3: Fonction de validation d'email robuste
  const validateEmail = (email: string): boolean => {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  // Validation du téléphone (optionnel mais si rempli, doit être valide)
  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Optionnel
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone.trim());
  };

  // 🎯 ÉTAPE 1: Validation locale complète des champs
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validation du nom (requis)
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Le nom est obligatoire';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    // Validation de l'email (requis)
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = 'L\'adresse e-mail est obligatoire';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Adresse e-mail invalide';
    }

    // Validation du téléphone (optionnel mais doit être valide si rempli)
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }

    // Validation du message (requis)
    if (!formData.message || !formData.message.trim()) {
      newErrors.message = 'Le message est obligatoire';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Validation en temps réel pour une meilleure UX
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined, general: undefined }));
    }

    // Clear success message when user modifies form
    if (success) {
      setSuccess('');
    }
  }, [errors, success]);

  // 🎯 ÉTAPE 2: Protection sur le submit avec validation complète
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset des messages précédents
    setErrors({});
    setSuccess('');
    
    // Validation avant envoi
    if (!validateForm()) {
      setErrors(prev => ({ 
        ...prev, 
        general: 'Veuillez corriger les erreurs ci-dessus avant de soumettre le formulaire.' 
      }));
      return;
    }

    setFormSubmitting(true);
    
    try {
      // Simulation d'envoi avec gestion d'erreur
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulation d'une erreur réseau occasionnelle (5% de chance)
          if (Math.random() < 0.05) {
            reject(new Error('Erreur réseau'));
          } else {
            resolve(true);
          }
        }, 2000);
      });
      
      // 🎯 ÉTAPE 5: Feedback après envoi réussi
      setSuccess('Votre message a bien été envoyé ! Nous vous répondrons dans les plus brefs délais.');
      setFormSubmitted(true);
      
      // Reset du formulaire
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        eventType: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormSubmitted(false);
        setSuccess('');
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ 
        general: 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou nous contacter directement.' 
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleRetry = () => {
    setHasError(false);
    window.location.reload();
  };

  // Gestion d'erreur de chargement
  if (hasError) {
    return (
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <DataError 
            message="Impossible de charger le formulaire de contact"
            retry={handleRetry}
          />
        </div>
      </section>
    );
  }

  // Affichage de confirmation après envoi réussi
  if (state.formSubmitted && success) {
    return (
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Merci pour votre message !
              </h3>
              <p className="text-gray-600 mb-4">
                {success}
              </p>
              <button
                onClick={() => {
                  setFormSubmitted(false);
                  setSuccess('');
                }}
                className="text-gold hover:text-gold-dark transition-colors"
              >
                Envoyer un autre message
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-4 transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Contactez-nous
          </h2>
          <p className={`text-xl text-gray-600 max-w-3xl mx-auto transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
            Discutons de votre projet d'exception
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Contactez-nous directement
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Téléphone</h4>
                    <p className="text-gray-600">{contact.phone}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">{contact.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Adresse</h4>
                    <p className="text-gray-600">{contact.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              {/* 🎯 ÉTAPE 4: Affichage dynamique des erreurs générales */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{errors.general}</p>
                </div>
              )}

              {/* Message de succès temporaire */}
              {success && !state.formSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-green-700 text-sm">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-colors ${
                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Votre nom complet"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-colors ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="votre@email.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-colors ${
                        errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Votre téléphone (optionnel)"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                    {errors.phone && (
                      <p id="phone-error" className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date souhaitée
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'événement
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="wedding">Mariage</option>
                    <option value="corporate">Événement corporate</option>
                    <option value="private">Fête privée</option>
                    <option value="luxury">Événement de luxe</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-colors ${
                      errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Décrivez votre projet d'événement en détail..."
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={state.isFormSubmitting}
                  className="w-full bg-gradient-to-r from-gold to-gold-light text-white py-3 px-6 rounded-lg font-medium hover:shadow-gold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {state.isFormSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Envoyer le message
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  * Champs obligatoires. Vos données sont protégées et ne seront jamais partagées.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;