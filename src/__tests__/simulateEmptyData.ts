/**
 * Simulation de données vides pour tester la robustesse des composants
 */

// Données vides pour les services
export const emptyServicesData = {
  services: []
};

// Données vides pour les témoignages
export const emptyTestimonialsData = {
  testimonials: []
};

// Données vides pour les références
export const emptyReferencesData = {
  references: []
};

// Données vides pour les disponibilités
export const emptyAvailabilityData = {
  availability: []
};

// Données vides pour le contenu
export const emptyContentData = {
  hero: {
    title: "",
    subtitle: "",
    tagline: "",
    description: "",
    cta: ""
  },
  about: {
    title: "",
    description: "",
    values: []
  },
  contact: {
    title: "",
    subtitle: "",
    phone: "",
    email: "",
    address: ""
  },
  footer: {
    tagline: "",
    credits: ""
  }
};

// Données malformées pour tester la robustesse
export const malformedServicesData = {
  // Structure incorrecte - pas de propriété 'services'
  data: null,
  items: undefined
};

export const invalidServicesData = {
  services: [
    null,
    undefined,
    {},
    { id: "incomplete" }, // Manque des propriétés
    { title: "No ID" }, // Manque l'ID
    "string instead of object", // Type incorrect
    { 
      id: "invalid-features",
      title: "Test",
      description: "Test",
      icon: "Heart",
      image: "test.jpg",
      features: "not an array" // Features doit être un tableau
    }
  ]
};

// Scénarios de test complets
export const testScenarios = {
  empty: emptyServicesData,
  malformed: malformedServicesData,
  invalid: invalidServicesData,
  null: null,
  undefined: undefined,
  emptyObject: {},
  wrongStructure: { wrongKey: [] }
};

// Fonction pour simuler l'échec de chargement d'un fichier JSON
export const simulateJSONLoadFailure = () => {
  throw new Error('Failed to load JSON file');
};

// Fonction pour tester tous les scénarios
export const testAllScenarios = (componentName: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`Testing ${componentName} with various data scenarios`);
    
    Object.entries(testScenarios).forEach(([scenarioName, data]) => {
      console.log(`Scenario: ${scenarioName}`, data);
    });
    
    console.groupEnd();
  }
};