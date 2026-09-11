import { describe, it, expect } from 'vitest';
import {
  update,
  toValues,
  updateAll,
  validate,
  toDirty,
  updateAndValidate,
  dirtyAndValidate,
  toDirtyAll,
  validateAll,
  dirtyAndValidateAll,
  hasAnyInvalid,
  setBackendErrors,
} from './forms';

describe('Forms Utility', () => {
  const mockInputs = {
    username: {
      value: '',
      dirty: 'false',
      invalid: 'false',
      validation: (value: string) => value.length >= 3,
    },
    email: {
      value: '',
      dirty: 'false',
      invalid: 'false',
      validation: (value: string) => value.includes('@'),
    },
    description: {
      value: '',
      dirty: 'false',
      invalid: 'false',
    },
  };

  describe('update', () => {
    it('should update field value', () => {
      const result = update(mockInputs, 'username', 'john');

      expect(result.username.value).toBe('john');
      expect(result.username.dirty).toBe('false');
      expect(result.username.invalid).toBe('false');
    });

    it('should not modify other fields', () => {
      const result = update(mockInputs, 'username', 'john');

      expect(result.email).toEqual(mockInputs.email);
      expect(result.description).toEqual(mockInputs.description);
    });

    it('should handle different field types', () => {
      const result = update(mockInputs, 'email', 'test@example.com');

      expect(result.email.value).toBe('test@example.com');
    });
  });

  describe('toValues', () => {
    it('should extract values from all fields', () => {
      const inputs = {
        username: { value: 'john', dirty: 'true', invalid: 'false' },
        email: { value: 'john@test.com', dirty: 'true', invalid: 'false' },
      };

      const result = toValues(inputs);

      expect(result).toEqual({
        username: 'john',
        email: 'john@test.com',
      });
    });

    it('should handle empty values', () => {
      const result = toValues(mockInputs);

      expect(result.username).toBe('');
      expect(result.email).toBe('');
      expect(result.description).toBe('');
    });
  });

  describe('updateAll', () => {
    it('should update multiple field values', () => {
      const newValues = {
        username: 'john',
        email: 'john@test.com',
        description: 'test description',
      };

      const result = updateAll(mockInputs, newValues);

      expect(result.username.value).toBe('john');
      expect(result.email.value).toBe('john@test.com');
      expect(result.description.value).toBe('test description');
    });

    it('should preserve field metadata', () => {
      const result = updateAll(mockInputs, { username: 'john' });

      expect(result.username.dirty).toBe('false');
      expect(result.username.invalid).toBe('false');
    });
  });

  describe('validate', () => {
    it('should mark field as invalid when validation fails', () => {
      const inputs = {
        username: { value: 'ab', validation: (v: string) => v.length >= 3 },
      };

      const result = validate(inputs, 'username');

      expect(result.username.invalid).toBe('true');
    });

    it('should mark field as valid when validation passes', () => {
      const inputs = {
        username: { value: 'john', validation: (v: string) => v.length >= 3 },
      };

      const result = validate(inputs, 'username');

      expect(result.username.invalid).toBe('false');
    });

    it('should not validate fields without validation function', () => {
      const inputs = {
        description: { value: '', invalid: 'false' },
      };

      const result = validate(inputs, 'description');

      expect(result.description.invalid).toBe('false');
    });
  });

  describe('toDirty', () => {
    it('should mark field as dirty', () => {
      const result = toDirty(mockInputs, 'username');

      expect(result.username.dirty).toBe('true');
    });

    it('should not affect other fields', () => {
      const result = toDirty(mockInputs, 'username');

      expect(result.email.dirty).toBe('false');
    });
  });

  describe('updateAndValidate', () => {
    it('should update and validate field', () => {
      const result = updateAndValidate(mockInputs, 'username', 'ab');

      expect(result.username.value).toBe('ab');
      expect(result.username.invalid).toBe('true');
    });

    it('should pass validation for valid input', () => {
      const result = updateAndValidate(mockInputs, 'username', 'john');

      expect(result.username.value).toBe('john');
      expect(result.username.invalid).toBe('false');
    });
  });

  describe('dirtyAndValidate', () => {
    it('should mark field dirty and validate', () => {
      const inputs = {
        username: { value: 'ab', validation: (v: string) => v.length >= 3 },
      };

      const result = dirtyAndValidate(inputs, 'username');

      expect(result.username.dirty).toBe('true');
      expect(result.username.invalid).toBe('true');
    });
  });

  describe('toDirtyAll', () => {
    it('should mark all fields as dirty', () => {
      const result = toDirtyAll(mockInputs);

      expect(result.username.dirty).toBe('true');
      expect(result.email.dirty).toBe('true');
      expect(result.description.dirty).toBe('true');
    });
  });

  describe('validateAll', () => {
    it('should validate all fields with validation functions', () => {
      const inputs = {
        username: { value: 'ab', validation: (v: string) => v.length >= 3 },
        email: { value: 'invalid', validation: (v: string) => v.includes('@') },
      };

      const result = validateAll(inputs);

      expect(result.username.invalid).toBe('true');
      expect(result.email.invalid).toBe('true');
    });

    it('should not validate fields without validation', () => {
      const inputs = {
        username: { value: 'john', validation: (v: string) => v.length >= 3 },
        description: { value: '' },
      };

      const result = validateAll(inputs);

      expect(result.username.invalid).toBe('false');
      expect(result.description).toEqual({ value: '' });
    });
  });

  describe('dirtyAndValidateAll', () => {
    it('should mark all fields dirty and validate', () => {
      const inputs = {
        username: { value: 'ab', validation: (v: string) => v.length >= 3 },
        email: { value: 'test@test.com', validation: (v: string) => v.includes('@') },
      };

      const result = dirtyAndValidateAll(inputs);

      expect(result.username.dirty).toBe('true');
      expect(result.username.invalid).toBe('true');
      expect(result.email.dirty).toBe('true');
      expect(result.email.invalid).toBe('false');
    });
  });

  describe('hasAnyInvalid', () => {
    it('should return true when any field is dirty and invalid', () => {
      const inputs = {
        username: { dirty: 'true', invalid: 'true' },
        email: { dirty: 'true', invalid: 'false' },
      };

      expect(hasAnyInvalid(inputs)).toBe(true);
    });

    it('should return false when no fields are invalid', () => {
      const inputs = {
        username: { dirty: 'true', invalid: 'false' },
        email: { dirty: 'true', invalid: 'false' },
      };

      expect(hasAnyInvalid(inputs)).toBe(false);
    });

    it('should return false when invalid but not dirty', () => {
      const inputs = {
        username: { dirty: 'false', invalid: 'true' },
      };

      expect(hasAnyInvalid(inputs)).toBe(false);
    });

    it('should return false for empty inputs', () => {
      expect(hasAnyInvalid({})).toBe(false);
    });
  });

  describe('setBackendErrors', () => {
    it('should set errors from backend', () => {
      const errors = [
        { fieldName: 'username', message: 'Username already exists' },
        { fieldName: 'email', message: 'Invalid email format' },
      ];

      const result = setBackendErrors(mockInputs, errors);

      expect(result.username.message).toBe('Username already exists');
      expect(result.username.dirty).toBe('true');
      expect(result.username.invalid).toBe('true');
      expect(result.email.message).toBe('Invalid email format');
      expect(result.email.dirty).toBe('true');
      expect(result.email.invalid).toBe('true');
    });

    it('should handle single error', () => {
      const errors = [{ fieldName: 'username', message: 'Required field' }];

      const result = setBackendErrors(mockInputs, errors);

      expect(result.username.message).toBe('Required field');
      expect(result.username.invalid).toBe('true');
    });

    it('should not affect unmentioned fields', () => {
      const errors = [{ fieldName: 'username', message: 'Error' }];

      const result = setBackendErrors(mockInputs, errors);

      expect(result.email).toEqual(mockInputs.email);
    });
  });
});
