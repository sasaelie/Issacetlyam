import React, { useEffect, useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useAppState } from '../store/AppContext';
import { validateData, validateArray, validateAvailabilitySlot } from '../utils/dataValidation';
import DataError from './DataError';
import EmptyState from './EmptyState';

// Import sécurisé avec gestion d'erreur complète
let availabilityData: any = {};
try {
  availabilityData = require('../data/availability.json');
} catch (error) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('Impossible de charger availability.json:', error);
  }
  availabilityData = { availability: [] };
}

// Import des dates réservées
let bookedDatesData: any = {};
try {
  bookedDatesData = require('../data/booked-dates.json');
} catch (error) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('Impossible de charger booked-dates.json:', error);
  }
  bookedDatesData = { bookedDates: [] };
}

interface AvailabilitySlot {
  date: string;
  available: boolean;
  type: string;
}

const BookingCalendar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'booking' | 'success' | 'error'>('idle');
  const [bookingMessage, setBookingMessage] = useState<string>('');
  const { state, setSelectedDate } = useAppState();

  // 🎯 ÉTAPE 1: Validation des données d'entrée avec fallback sécurisé
  const { availability = [] } = availabilityData || {};
  const { bookedDates = [] } = bookedDatesData || {};
  
  // 🎯 ÉTAPE 2: Protection avant boucle - Validation robuste des données
  if (!Array.isArray(availability)) {
    console.error('❌ availability doit être un tableau, reçu:', typeof availability);
    return (
      <section id="calendar" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <DataError message="Aucun créneau disponible pour le moment." />
        </div>
      </section>
    );
  }

  // Validation robuste des données avec filtrage sécurisé
  const validAvailability = availability.filter((slot): slot is AvailabilitySlot => {
    const isValid = validateAvailabilitySlot(slot);
    if (process.env.NODE_ENV === 'development' && !isValid) {
      console.warn('Invalid availability slot:', slot);
    }
    return isValid;
  });

  // Validation des dates réservées
  const validBookedDates = Array.isArray(bookedDates) ? bookedDates.filter(date => typeof date === 'string') : [];

  // 🎯 ÉTAPE 4: Console de vérification en dev
  if (process.env.NODE_ENV === 'development') {
    console.assert(Array.isArray(availability), "❌ availability doit être un tableau.");
    console.assert(validateData(availabilityData), "❌ availabilityData doit être un objet valide.");
  }

  // Créneaux horaires disponibles
  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('calendar');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Fonction de réservation
  const handleBooking = async () => {
    if (!state.selectedDate || !selectedTime) {
      setBookingMessage('Veuillez sélectionner une date et une heure.');
      setBookingStatus('error');
      return;
    }

    // Vérifier si la date est déjà réservée
    if (validBookedDates.includes(state.selectedDate)) {
      setBookingMessage('Cette date est déjà réservée. Veuillez choisir une autre date.');
      setBookingStatus('error');
      return;
    }

    setBookingStatus('booking');
    setBookingMessage('');

    try {
      // Simulation d'envoi de réservation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Log pour simulation
      if (process.env.NODE_ENV === 'development') {
        console.log('📅 Réservation simulée:', {
          date: state.selectedDate,
          time: selectedTime,
          timestamp: new Date().toISOString()
        });
      }

      setBookingStatus('success');
      setBookingMessage(`Votre demande de réservation pour le ${formatDate(state.selectedDate)} à ${selectedTime} a été envoyée avec succès ! Nous vous contacterons rapidement pour confirmer.`);
      
      // Reset après 5 secondes
      setTimeout(() => {
        setBookingStatus('idle');
        setBookingMessage('');
        setSelectedDate(null);
        setSelectedTime('');
      }, 5000);
      
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      setBookingStatus('error');
      setBookingMessage('Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer ou nous contacter directement.');
    }
  };

  const handleRetry = () => {
    setHasError(false);
    window.location.reload();
  };

  const formatDate = (dateString: string) => {
    if (!dateString || typeof dateString !== 'string') {
      return 'Date invalide';
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (slot: { available: boolean; type: string }) => {
    // Vérifier si la date est dans les dates réservées
    if (validBookedDates.includes(slot.date)) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    if (!slot.available) return 'bg-red-100 text-red-800 border-red-200';
    if (slot.type === 'weekend') return 'bg-gold-light text-white border-gold';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getStatusIcon = (slot: { available: boolean }) => {
    // Vérifier si la date est dans les dates réservées
    if (validBookedDates.includes(slot.date)) {
      return <XCircle className="w-4 h-4" />;
    }
    if (!slot.available) return <XCircle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const getStatusText = (slot: { available: boolean; type: string }) => {
    // Vérifier si la date est dans les dates réservées
    if (validBookedDates.includes(slot.date)) {
      return 'Déjà réservé';
    }
    if (!slot.available) {
      if (slot.type === 'booked') return 'Réservé';
      if (slot.type === 'holiday') return 'Férié';
      return 'Indisponible';
    }
    if (slot.type === 'weekend') return 'Week-end disponible';
    return 'Disponible';
  };

  // Gestion d'erreur
  if (hasError) {
    return (
      <section id="calendar" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <DataError 
            message="Impossible de charger le calendrier de disponibilités"
            retry={handleRetry}
          />
        </div>
      </section>
    );
  }

  return (
    <section id="calendar" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-4 transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Disponibilités
          </h2>
          <p className={`text-xl text-gray-600 max-w-3xl mx-auto transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
            Consultez nos créneaux disponibles et sélectionnez votre date
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* 🎯 ÉTAPE 3: Fallback visuel élégant */}
          {validAvailability.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {validAvailability.map((slot, index) => (
                <div
                  key={slot.date || `slot-${index}`}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    state.selectedDate === slot.date 
                      ? 'border-gold bg-gold-light text-white shadow-gold' 
                      : `${getStatusColor(slot)} hover:shadow-lg`
                  } ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                  onClick={() => {
                    const isDateBooked = validBookedDates.includes(slot.date);
                    if (slot.available && !isDateBooked) {
                      setSelectedDate(slot.date);
                      setBookingStatus('idle');
                      setBookingMessage('');
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5" />
                      <div>
                        <p className="font-semibold">
                          {formatDate(slot.date)}
                        </p>
                        <p className="text-sm opacity-80">
                          {getStatusText(slot)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(slot)}
                      {slot.type === 'weekend' && (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-8">
              <EmptyState 
                title="Calendrier en cours de mise à jour"
                message="Les disponibilités seront affichées ici prochainement. Contactez-nous directement pour connaître nos créneaux disponibles."
                icon={Calendar}
                className="text-center text-gray-500"
              />
            </div>
          )}

          {state.selectedDate && (
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gold">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Réserver votre créneau
              </h3>
              
              <div className="mb-4">
                <p className="text-lg text-gray-700 mb-2">
                  <strong>Date sélectionnée :</strong> {formatDate(state.selectedDate)}
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choisissez un créneau horaire :
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  >
                    <option value="">Sélectionnez une heure</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Messages de statut */}
              {bookingMessage && (
                <div className={`mb-4 p-3 rounded-lg flex items-start space-x-2 ${
                  bookingStatus === 'success' ? 'bg-green-50 text-green-700' :
                  bookingStatus === 'error' ? 'bg-red-50 text-red-700' :
                  'bg-blue-50 text-blue-700'
                }`}>
                  {bookingStatus === 'success' && <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                  {bookingStatus === 'error' && <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                  <p className="text-sm">{bookingMessage}</p>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={!selectedTime || bookingStatus === 'booking' || bookingStatus === 'success'}
                className="w-full bg-gradient-to-r from-gold to-gold-light text-white py-3 px-6 rounded-lg font-medium hover:shadow-gold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {bookingStatus === 'booking' ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Envoi en cours...
                  </>
                ) : bookingStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Demande envoyée !
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5 mr-2" />
                    Réserver cette date
                  </>
                )}
              </button>
              
              {bookingStatus === 'idle' && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  Une demande de confirmation vous sera envoyée par email
                </p>
              )}
            </div>
          )}

          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Disponible</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gold rounded-full"></div>
                <span>Week-end</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Indisponible</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingCalendar;