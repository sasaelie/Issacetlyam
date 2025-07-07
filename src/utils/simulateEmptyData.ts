/**
 * Jeux de données vides pour les tests
 */

export const emptyServicesData = {
  services: []
};

export const emptyTestimonialsData = {
  testimonials: []
};

export const emptyReferencesData = {
  references: []
};

export const emptyAvailabilityData = {
  availability: []
};

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

export const malformedServicesData = {
  // Structure incorrecte
  data: null,
  items: undefined
};

export const invalidServicesData = {
  services: [
    null,
    undefined,
    {},
    { id: "incomplete" },
    { title: "No ID" },
    "string instead of object"
  ]
};

// Scénarios de test
export const testScenarios = {
  empty: emptyServicesData,
  malformed: malformedServicesData,
  invalid: invalidServicesData,
  null: null,
  undefined: undefined
};