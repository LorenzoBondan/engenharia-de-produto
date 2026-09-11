import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as requests from '../../utils/requests';
import {
  mockAxiosGet,
  mockAxiosPost,
  mockAxiosPut,
  mockAxiosDelete,
  mockAxiosError,
  clearAllAxiosMocks,
} from './axiosMock';

vi.mock('../../utils/requests');

describe('Axios Mock Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('mockAxiosGet', () => {
    it('should mock GET request with response data', async () => {
      const responseData = { id: 1, name: 'Test' };
      mockAxiosGet('/api/test', responseData);

      const result = await requests.requestBackend({
        method: 'GET',
        url: '/api/test',
      });

      expect(result.data).toEqual(responseData);
      expect(result.status).toBe(200);
    });

    it('should mock GET request with custom status code', async () => {
      const responseData = { message: 'Success' };
      mockAxiosGet('/api/test', responseData, 201);

      const result = await requests.requestBackend({
        method: 'GET',
        url: '/api/test',
      });

      expect(result.data).toEqual(responseData);
      expect(result.status).toBe(201);
    });
  });

  describe('mockAxiosPost', () => {
    it('should mock POST request with response data', async () => {
      const responseData = { id: 1, created: true };
      mockAxiosPost('/api/create', responseData);

      const result = await requests.requestBackend({
        method: 'POST',
        url: '/api/create',
        data: { name: 'New Item' },
      });

      expect(result.data).toEqual(responseData);
      expect(result.status).toBe(200);
    });

    it('should mock POST request with custom status code', async () => {
      const responseData = { id: 1 };
      mockAxiosPost('/api/create', responseData, 201);

      const result = await requests.requestBackend({
        method: 'POST',
        url: '/api/create',
      });

      expect(result.status).toBe(201);
    });
  });

  describe('mockAxiosPut', () => {
    it('should mock PUT request with response data', async () => {
      const responseData = { id: 1, updated: true };
      mockAxiosPut('/api/update/1', responseData);

      const result = await requests.requestBackend({
        method: 'PUT',
        url: '/api/update/1',
        data: { name: 'Updated' },
      });

      expect(result.data).toEqual(responseData);
      expect(result.status).toBe(200);
    });
  });

  describe('mockAxiosDelete', () => {
    it('should mock DELETE request with response data', async () => {
      const responseData = { deleted: true };
      mockAxiosDelete('/api/delete/1', responseData);

      const result = await requests.requestBackend({
        method: 'DELETE',
        url: '/api/delete/1',
      });

      expect(result.data).toEqual(responseData);
      expect(result.status).toBe(200);
    });

    it('should mock DELETE with 204 status', async () => {
      mockAxiosDelete('/api/delete/1', null, 204);

      const result = await requests.requestBackend({
        method: 'DELETE',
        url: '/api/delete/1',
      });

      expect(result.status).toBe(204);
    });
  });

  describe('mockAxiosError', () => {
    it('should mock axios error with 404 status', async () => {
      mockAxiosError('/api/notfound', 'Not Found', 404);

      await expect(
        requests.requestBackend({
          method: 'GET',
          url: '/api/notfound',
        })
      ).rejects.toThrow('Not Found');
    });

    it('should mock axios error with 500 status', async () => {
      mockAxiosError('/api/error', 'Internal Server Error', 500);

      await expect(
        requests.requestBackend({
          method: 'GET',
          url: '/api/error',
        })
      ).rejects.toThrow();
    });

    it('should mock axios error with custom message', async () => {
      const customMessage = 'Custom error message';
      mockAxiosError('/api/custom-error', customMessage, 400);

      await expect(
        requests.requestBackend({
          method: 'GET',
          url: '/api/custom-error',
        })
      ).rejects.toThrow(customMessage);
    });
  });

  describe('clearAllAxiosMocks', () => {
    it('should clear all mocked axios calls', () => {
      mockAxiosGet('/api/test', { data: 'test' });

      clearAllAxiosMocks();

      expect(vi.mocked(requests.requestBackend)).not.toHaveBeenCalled();
    });
  });
});
