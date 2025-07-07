import React from 'react';
import { render, screen } from '@testing-library/react';
import Services from '../Services';

// Mock du fichier JSON pour les tests
jest.mock('../../data/services.json', () => ({
  services: [
    {
      id: 'test-service',
      title: 'Service Test',
      description: 'Description test',
      icon: 'Heart',
      image: 'https://example.com/image.jpg',
      features: ['Feature 1', 'Feature 2']
    }
  ]
}));

// Mock de l'IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn()
}));

describe('Services Component', () => {
  beforeEach(() => {
    // Reset des mocks avant chaque test
    jest.clearAllMocks();
  });

  test('renders without crashing with valid data', () => {
    render(<Services />);
    expect(screen.getByText('Nos Services')).toBeInTheDocument();
  });

  test('displays fallback when services data is empty', () => {
    // Mock temporaire avec données vides
    jest.doMock('../../data/services.json', () => ({
      services: []
    }));
    
    render(<Services />);
    expect(screen.getByText(/Aucun service disponible actuellement/)).toBeInTheDocument();
  });

  test('handles missing services.json gracefully', () => {
    // Mock d'une erreur de chargement
    jest.doMock('../../data/services.json', () => {
      throw new Error('File not found');
    });
    
    render(<Services />);
    // Le composant doit toujours s'afficher même si le fichier est absent
    expect(screen.getByText('Nos Services')).toBeInTheDocument();
  });

  test('filters out invalid service objects', () => {
    // Mock avec données partiellement invalides
    jest.doMock('../../data/services.json', () => ({
      services: [
        {
          id: 'valid-service',
          title: 'Valid Service',
          description: 'Valid description',
          icon: 'Heart',
          image: 'https://example.com/image.jpg',
          features: ['Feature 1']
        },
        {
          // Service invalide - manque des propriétés requises
          id: 'invalid-service',
          title: 'Invalid Service'
          // Manque description, icon, image, features
        },
        null, // Service null
        undefined // Service undefined
      ]
    }));
    
    render(<Services />);
    
    // Seul le service valide doit être affiché
    expect(screen.getByText('Valid Service')).toBeInTheDocument();
    expect(screen.queryByText('Invalid Service')).not.toBeInTheDocument();
  });

  test('handles malformed JSON structure', () => {
    // Mock avec structure JSON incorrecte
    jest.doMock('../../data/services.json', () => ({
      // Pas de propriété 'services'
      data: []
    }));
    
    render(<Services />);
    expect(screen.getByText(/Aucun service disponible actuellement/)).toBeInTheDocument();
  });

  test('uses fallback icon when icon is not found', () => {
    jest.doMock('../../data/services.json', () => ({
      services: [
        {
          id: 'test-service',
          title: 'Test Service',
          description: 'Test description',
          icon: 'NonExistentIcon', // Icône qui n'existe pas
          image: 'https://example.com/image.jpg',
          features: ['Feature 1']
        }
      ]
    }));
    
    render(<Services />);
    // Le composant doit utiliser l'icône par défaut (Building) sans planter
    expect(screen.getByText('Test Service')).toBeInTheDocument();
  });
});