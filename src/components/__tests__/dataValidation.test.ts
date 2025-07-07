import { validateData, validateArray, safeParseJSON, safeImportJSON, devAssert } from '../../utils/dataValidation';
import { testScenarios } from '../../utils/simulateEmptyData';

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
      expect(validateData(true)).toBe(false);
    });
  });

  describe('validateArray', () => {
    test('should return true for non-empty arrays', () => {
      expect(validateArray([1, 2, 3])).toBe(true);
      expect(validateArray(['a', 'b'])).toBe(true);
      expect(validateArray([{}])).toBe(true);
    });

    test('should return false for empty arrays or non-arrays', () => {
      expect(validateArray([])).toBe(false);
      expect(validateArray(null)).toBe(false);
      expect(validateArray(undefined)).toBe(false);
      expect(validateArray({})).toBe(false);
      expect(validateArray('string')).toBe(false);
    });
  });

  describe('safeParseJSON', () => {
    test('should parse valid JSON', () => {
      const result = safeParseJSON('{"key": "value"}', {});
      expect(result).toEqual({ key: 'value' });
    });

    test('should return fallback for invalid JSON', () => {
      const fallback = { default: true };
      const result = safeParseJSON('invalid json', fallback);
      expect(result).toBe(fallback);
    });

    test('should return fallback for non-object JSON', () => {
      const fallback = { default: true };
      const result = safeParseJSON('"string"', fallback);
      expect(result).toBe(fallback);
    });
  });

  describe('safeImportJSON', () => {
    test('should return data from successful import', () => {
      const mockImport = () => ({ services: [] });
      const result = safeImportJSON(mockImport, { fallback: true });
      expect(result).toEqual({ services: [] });
    });

    test('should return fallback when import fails', () => {
      const mockImport = () => { throw new Error('Import failed'); };
      const fallback = { fallback: true };
      const result = safeImportJSON(mockImport, fallback);
      expect(result).toBe(fallback);
    });

    test('should return fallback when import returns invalid data', () => {
      const mockImport = () => null;
      const fallback = { fallback: true };
      const result = safeImportJSON(mockImport, fallback);
      expect(result).toBe(fallback);
    });
  });

  describe('Test Scenarios', () => {
    test('should handle all test scenarios without crashing', () => {
      Object.entries(testScenarios).forEach(([name, scenario]) => {
        expect(() => {
          validateData(scenario);
          validateArray(scenario?.services || scenario);
        }).not.toThrow();
      });
    });
  });
});