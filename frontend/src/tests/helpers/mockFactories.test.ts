import { describe, it, expect } from 'vitest';
import {
  createMockUser,
  createMockAccessToken,
  createMockAxiosResponse,
  createMockAxiosError,
  createMockPaginatedResponse,
  RoleEnum,
} from './mockFactories';

describe('Mock Factories', () => {
  describe('createMockUser', () => {
    it('should create user with default properties', () => {
      const user = createMockUser();

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('roles');
      expect(user).toHaveProperty('active');
      expect(Array.isArray(user.roles)).toBe(true);
    });

    it('should create user with custom properties via overrides', () => {
      const user = createMockUser({
        id: 42,
        username: 'testuser',
        email: 'test@example.com',
      });

      expect(user.id).toBe(42);
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
    });

    it('should merge overrides with defaults', () => {
      const user = createMockUser({ username: 'custom' });

      expect(user.username).toBe('custom');
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
    });
  });

  describe('createMockAccessToken', () => {
    it('should create access token payload with default properties', () => {
      const token = createMockAccessToken();

      expect(token).toHaveProperty('username');
      expect(token).toHaveProperty('exp');
      expect(token).toHaveProperty('authorities');
      expect(Array.isArray(token.authorities)).toBe(true);
      expect(typeof token.exp).toBe('number');
    });

    it('should create token with future expiration by default', () => {
      const token = createMockAccessToken();
      const nowInSeconds = Math.floor(Date.now() / 1000);

      expect(token.exp).toBeGreaterThan(nowInSeconds);
    });

    it('should create token with custom expiration and roles', () => {
      const customExp = 9999999999;
      const token = createMockAccessToken({
        exp: customExp,
        authorities: ['ROLE_ADMIN'],
      });

      expect(token.exp).toBe(customExp);
      expect(token.authorities).toContain('ROLE_ADMIN');
    });

    it('should accept partial overrides', () => {
      const token = createMockAccessToken({ username: 'admin' });

      expect(token.username).toBe('admin');
      expect(token).toHaveProperty('exp');
      expect(token).toHaveProperty('authorities');
    });
  });

  describe('createMockAxiosResponse', () => {
    it('should create axios response with provided data', () => {
      const data = { id: 1, name: 'Test' };
      const response = createMockAxiosResponse(data);

      expect(response.data).toEqual(data);
      expect(response.status).toBe(200);
      expect(response.statusText).toBe('OK');
      expect(response).toHaveProperty('headers');
      expect(response).toHaveProperty('config');
    });

    it('should create response with custom status code', () => {
      const data = { message: 'Created' };
      const response = createMockAxiosResponse(data, 201);

      expect(response.data).toEqual(data);
      expect(response.status).toBe(201);
    });

    it('should handle different data types', () => {
      const stringResponse = createMockAxiosResponse('success');
      expect(stringResponse.data).toBe('success');

      const arrayResponse = createMockAxiosResponse([1, 2, 3]);
      expect(arrayResponse.data).toEqual([1, 2, 3]);

      const nullResponse = createMockAxiosResponse(null);
      expect(nullResponse.data).toBeNull();
    });
  });

  describe('createMockAxiosError', () => {
    it('should create axios error with message', () => {
      const error = createMockAxiosError('Network Error');

      expect(error.message).toBe('Network Error');
      expect(error).toHaveProperty('response');
    });

    it('should create error with custom status code', () => {
      const error = createMockAxiosError('Not Found', 404);

      expect(error.message).toBe('Not Found');
      expect(error.response?.status).toBe(404);
    });

    it('should create error with response data', () => {
      const error = createMockAxiosError('Validation Error', 400);

      expect(error.response?.status).toBe(400);
      expect(error.response).toHaveProperty('data');
      expect(error.response).toHaveProperty('statusText');
    });

    it('should handle server errors', () => {
      const error = createMockAxiosError('Internal Server Error', 500);

      expect(error.response?.status).toBe(500);
    });
  });

  describe('createMockPaginatedResponse', () => {
    it('should create paginated response with content and metadata', () => {
      const content = [{ id: 1 }, { id: 2 }];
      const response = createMockPaginatedResponse(content, 0, 10, false);

      expect(response.content).toEqual(content);
      expect(response.page).toBe(0);
      expect(response.size).toBe(10);
      expect(response.last).toBe(false);
      expect(response).toHaveProperty('totalElements');
      expect(response).toHaveProperty('totalPages');
      expect(response).toHaveProperty('first');
    });

    it('should mark first page correctly', () => {
      const content = [{ id: 1 }];
      const response = createMockPaginatedResponse(content, 0, 10, false);

      expect(response.first).toBe(true);
    });

    it('should mark non-first page correctly', () => {
      const content = [{ id: 1 }];
      const response = createMockPaginatedResponse(content, 1, 10, false);

      expect(response.first).toBe(false);
    });

    it('should handle last page flag', () => {
      const content = [{ id: 1 }];
      const response = createMockPaginatedResponse(content, 2, 10, true);

      expect(response.last).toBe(true);
    });

    it('should calculate total elements from content length', () => {
      const content = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const response = createMockPaginatedResponse(content, 0, 10, false);

      expect(response.totalElements).toBe(3);
    });

    it('should handle empty content', () => {
      const response = createMockPaginatedResponse([], 0, 10, true);

      expect(response.content).toEqual([]);
      expect(response.totalElements).toBe(0);
      expect(response.last).toBe(true);
      expect(response.first).toBe(true);
    });
  });
});
