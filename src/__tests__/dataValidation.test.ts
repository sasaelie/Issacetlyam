import {
  validateData,
  validateArray,
  validateNonEmptyArray,
  validateService,
  validateTestimonial,
  validateReference,
  validateAvailabilitySlot,
  validateObjectProperties
} from '../utils/dataValidation';

describe('Data Validation Utils', () => {
  describe('validateData', () => {
    test('should return true for valid objects', () => {
      expect(validateData({})).toBe(true);
      expect(validateData({ key: 'value' })).toBe(true);
      expect(validateData([])).toBe(true);
    });

    test('should return false for invalid data', () => {
      expect(validateData(null)).toBe(false);
      expect(validateData(undefined)).toBe(false);
      expect(validateData('string')).toBe(false);
      expect(validateData(123)).toBe(false);
    });
  });

  describe('validateArray', () => {
    test('should return true for arrays', () => {
      expect(validateArray([])).toBe(true);
      expect(validateArray([1, 2, 3])).toBe(true);
    });

    test('should return false for non-arrays', () => {
      expect(validateArray({})).toBe(false);
      expect(validateArray(null)).toBe(false);
      expect(validateArray('string')).toBe(false);
    });
  });

  describe('validateNonEmptyArray', () => {
    test('should return true for non-empty arrays', () => {
      expect(validateNonEmptyArray([1])).toBe(true);
      expect(validateNonEmptyArray([1, 2, 3])).toBe(true);
    });

    test('should return false for empty arrays or non-arrays', () => {
      expect(validateNonEmptyArray([])).toBe(false);
      expect(validateNonEmptyArray({})).toBe(false);
      expect(validateNonEmptyArray(null)).toBe(false);
    });
  });

  describe('validateService', () => {
    const validService = {
      id: 'test',
      title: 'Test Service',
      description: 'Test description',
      icon: 'Heart',
      image: 'test.jpg',
      features: ['feature1', 'feature2']
    };

    test('should return true for valid service', () => {
      expect(validateService(validService)).toBe(true);
    });

    test('should return false for invalid service', () => {
      expect(validateService({})).toBe(false);
      expect(validateService({ id: 'test' })).toBe(false);
      expect(validateService({ ...validService, features: 'not an array' })).toBe(false);
    });
  });

  describe('validateTestimonial', () => {
    const validTestimonial = {
      id: 'test',
      name: 'Test User',
      event: 'Test Event',
      rating: 5,
      comment: 'Great service',
      visible: true
    };

    test('should return true for valid testimonial', () => {
      expect(validateTestimonial(validTestimonial)).toBe(true);
    });

    test('should return false for invalid testimonial', () => {
      expect(validateTestimonial({})).toBe(false);
      expect(validateTestimonial({ ...validTestimonial, rating: 'not a number' })).toBe(false);
    });
  });

  describe('validateReference', () => {
    const validReference = {
      id: 'test',
      name: 'Test Reference',
      type: 'Test Type',
      event: 'Test Event',
      year: '2024',
      visible: true
    };

    test('should return true for valid reference', () => {
      expect(validateReference(validReference)).toBe(true);
    });

    test('should return false for invalid reference', () => {
      expect(validateReference({})).toBe(false);
      expect(validateReference({ ...validReference, visible: 'not a boolean' })).toBe(false);
    });
  });

  describe('validateAvailabilitySlot', () => {
    const validSlot = {
      date: '2024-01-01',
      available: true,
      type: 'weekend'
    };

    test('should return true for valid slot', () => {
      expect(validateAvailabilitySlot(validSlot)).toBe(true);
    });

    test('should return false for invalid slot', () => {
      expect(validateAvailabilitySlot({})).toBe(false);
      expect(validateAvailabilitySlot({ ...validSlot, date: '' })).toBe(false);
    });
  });

  describe('validateObjectProperties', () => {
    test('should return true when all required properties exist', () => {
      const obj = { name: 'test', age: 25, email: 'test@test.com' };
      expect(validateObjectProperties(obj, ['name', 'age'])).toBe(true);
    });

    test('should return false when required properties are missing', () => {
      const obj = { name: 'test' };
      expect(validateObjectProperties(obj, ['name', 'age'])).toBe(false);
    });

    test('should return false for invalid objects', () => {
      expect(validateObjectProperties(null, ['name'])).toBe(false);
      expect(validateObjectProperties(undefined, ['name'])).toBe(false);
    });
  });
});