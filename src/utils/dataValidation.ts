/**
 * Utilitaires de validation des données pour garantir la robustesse
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateData = (data: any): boolean => {
  return data != null && typeof data === 'object';
};

export const validateArray = (data: any): data is any[] => {
  return Array.isArray(data);
};

export const validateNonEmptyArray = (data: any): data is any[] => {
  return Array.isArray(data) && data.length > 0;
};

export const safeParseJSON = <T>(jsonString: string, fallback: T): T => {
  try {
    const parsed = JSON.parse(jsonString);
    return validateData(parsed) ? parsed : fallback;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('JSON parsing failed:', error);
    }
    return fallback;
  }
};

export const safeImportJSON = <T>(importFn: () => T, fallback: T): T => {
  try {
    const data = importFn();
    return validateData(data) ? data : fallback;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('JSON import failed:', error);
    }
    return fallback;
  }
};

// Validation runtime en développement
export const devAssert = (condition: boolean, message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    if (!condition) {
      console.warn(`Assertion failed: ${message}`);
    }
    if (!condition && data) {
      console.warn('Validation failed for:', data);
    }
  }
};

// Validation des propriétés d'objet
export const validateObjectProperties = (obj: any, requiredProps: string[]): boolean => {
  if (!validateData(obj)) return false;
  
  return requiredProps.every(prop => {
    const hasProperty = obj.hasOwnProperty(prop) && obj[prop] != null;
    devAssert(hasProperty, `Missing required property: ${prop}`, obj);
    return hasProperty;
  });
};

// Validation spécifique pour les services
export const validateService = (service: any): boolean => {
  return validateObjectProperties(service, ['id', 'title', 'description', 'icon', 'image', 'features']) &&
         typeof service.id === 'string' &&
         typeof service.title === 'string' &&
         typeof service.description === 'string' &&
         typeof service.icon === 'string' &&
         typeof service.image === 'string' &&
         Array.isArray(service.features);
};

// Validation spécifique pour les témoignages
export const validateTestimonial = (testimonial: any): boolean => {
  return validateObjectProperties(testimonial, ['id', 'name', 'event', 'rating', 'comment', 'visible']) &&
         typeof testimonial.id === 'string' &&
         typeof testimonial.name === 'string' &&
         typeof testimonial.event === 'string' &&
         typeof testimonial.rating === 'number' &&
         typeof testimonial.comment === 'string' &&
         typeof testimonial.visible === 'boolean';
};

// Validation spécifique pour les références
export const validateReference = (reference: any): boolean => {
  return validateObjectProperties(reference, ['id', 'name', 'type', 'event', 'year', 'visible']) &&
         typeof reference.id === 'string' &&
         typeof reference.name === 'string' &&
         typeof reference.type === 'string' &&
         typeof reference.event === 'string' &&
         typeof reference.year === 'string' &&
         typeof reference.visible === 'boolean';
};

// Validation spécifique pour les créneaux de disponibilité
export const validateAvailabilitySlot = (slot: any): boolean => {
  return validateObjectProperties(slot, ['date', 'available', 'type']) &&
         typeof slot.date === 'string' &&
         typeof slot.available === 'boolean' &&
         typeof slot.type === 'string' &&
         slot.date.length > 0;
};