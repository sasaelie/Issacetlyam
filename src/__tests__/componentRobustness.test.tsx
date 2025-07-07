import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppProvider } from '../store/AppContext';

// Mock des données vides
jest.mock('../data/services.json', () => ({ services: [] }));
jest.mock('../data/testimonials.json', () => ({ testimonials: [] }));
jest.mock('../data/references.json', () => ({ references: [] }));
jest.mock('../data/availability.json', () => ({ availability: [] }));
jest.mock('../data/content.json', () => ({
  hero: { title: "", subtitle: "", tagline: "", description: "", cta: "" },
  about: { title: "", description: "", values: [] },
  contact: { title: "", subtitle: "", phone: "", email: "", address: "" },
  footer: { tagline: "", credits: "" }
}));

// Mock de l'IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn()
}));

// Wrapper pour les tests
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppProvider>{children}</AppProvider>
);

describe('Component Robustness Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Services component handles empty data gracefully', async () => {
    const Services = (await import('../components/Services')).default;
    
    render(
      <TestWrapper>
        <Services />
      </TestWrapper>
    );

    expect(screen.getByText('Nos Services')).toBeInTheDocument();
    expect(screen.getByText(/Aucun service disponible actuellement/)).toBeInTheDocument();
  });

  test('Testimonials component handles empty data gracefully', async () => {
    const Testimonials = (await import('../components/Testimonials')).default;
    
    render(
      <TestWrapper>
        <Testimonials />
      </TestWrapper>
    );

    expect(screen.getByText('Témoignages')).toBeInTheDocument();
    expect(screen.getByText(/Témoignages bientôt disponibles/)).toBeInTheDocument();
  });

  test('References component handles empty data gracefully', async () => {
    const References = (await import('../components/References')).default;
    
    render(
      <TestWrapper>
        <References />
      </TestWrapper>
    );

    expect(screen.getByText('Nos Références')).toBeInTheDocument();
    expect(screen.getByText(/Références bientôt disponibles/)).toBeInTheDocument();
  });

  test('BookingCalendar component handles empty data gracefully', async () => {
    const BookingCalendar = (await import('../components/BookingCalendar')).default;
    
    render(
      <TestWrapper>
        <BookingCalendar />
      </TestWrapper>
    );

    expect(screen.getByText('Disponibilités')).toBeInTheDocument();
    expect(screen.getByText(/Calendrier en cours de mise à jour/)).toBeInTheDocument();
  });

  test('Hero component handles empty data gracefully', async () => {
    const Hero = (await import('../components/Hero')).default;
    
    render(
      <TestWrapper>
        <Hero />
      </TestWrapper>
    );

    // Doit afficher les valeurs par défaut
    expect(screen.getByText('Isaac & Alyam')).toBeInTheDocument();
    expect(screen.getByText('Exclusive Events')).toBeInTheDocument();
  });

  test('ContactForm component handles empty data gracefully', async () => {
    const ContactForm = (await import('../components/ContactForm')).default;
    
    render(
      <TestWrapper>
        <ContactForm />
      </TestWrapper>
    );

    expect(screen.getByText('Contactez-nous')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Envoyer le message/ })).toBeInTheDocument();
  });
});