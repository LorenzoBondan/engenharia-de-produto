import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { requestBackend } from './requests';
import * as authService from '../services/authService';
import { BASE_URL } from './system';

vi.mock('axios');
vi.mock('../services/authService');
vi.mock('./history', () => ({
  history: {
    push: vi.fn(),
  },
}));

describe('Requests Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('requestBackend', () => {
    it('should build HTTP request with correct base URL', async () => {
      const mockResponse = { data: { id: 1 }, status: 200 };
      vi.mocked(axios).mockResolvedValue(mockResponse);

      const config = {
        method: 'GET',
        url: '/api/test',
      };

      await requestBackend(config);

      expect(axios).toHaveBeenCalledWith({
        ...config,
        baseURL: BASE_URL,
        headers: undefined,
      });
    });

    it('should add authorization header when withCredentials is true', async () => {
      const mockToken = 'test-token-123';
      vi.mocked(authService.getAccessToken).mockReturnValue(mockToken);
      vi.mocked(axios).mockResolvedValue({ data: {}, status: 200 });

      const config = {
        method: 'GET',
        url: '/api/secure',
        withCredentials: true,
      };

      await requestBackend(config);

      expect(authService.getAccessToken).toHaveBeenCalled();
      expect(axios).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/secure',
        baseURL: BASE_URL,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });
    });

    it('should not add authorization header when withCredentials is false', async () => {
      vi.mocked(axios).mockResolvedValue({ data: {}, status: 200 });

      const config = {
        method: 'GET',
        url: '/api/public',
        withCredentials: false,
      };

      await requestBackend(config);

      expect(authService.getAccessToken).not.toHaveBeenCalled();
      expect(axios).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/public',
        baseURL: BASE_URL,
        withCredentials: false,
        headers: undefined,
      });
    });

    it('should preserve existing headers when adding authorization', async () => {
      const mockToken = 'test-token';
      vi.mocked(authService.getAccessToken).mockReturnValue(mockToken);
      vi.mocked(axios).mockResolvedValue({ data: {}, status: 200 });

      const config = {
        method: 'POST',
        url: '/api/data',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      await requestBackend(config);

      expect(axios).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/data',
        baseURL: BASE_URL,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
      });
    });

    it('should handle POST request with data', async () => {
      vi.mocked(axios).mockResolvedValue({ data: { success: true }, status: 201 });

      const config = {
        method: 'POST',
        url: '/api/create',
        data: { name: 'Test Item' },
      };

      await requestBackend(config);

      expect(axios).toHaveBeenCalledWith({
        ...config,
        baseURL: BASE_URL,
        headers: undefined,
      });
    });

    it('should handle PUT request', async () => {
      vi.mocked(axios).mockResolvedValue({ data: { updated: true }, status: 200 });

      const config = {
        method: 'PUT',
        url: '/api/update/1',
        data: { name: 'Updated' },
      };

      await requestBackend(config);

      expect(axios).toHaveBeenCalledWith({
        ...config,
        baseURL: BASE_URL,
        headers: undefined,
      });
    });

    it('should handle DELETE request', async () => {
      vi.mocked(axios).mockResolvedValue({ data: {}, status: 204 });

      const config = {
        method: 'DELETE',
        url: '/api/delete/1',
      };

      await requestBackend(config);

      expect(axios).toHaveBeenCalledWith({
        ...config,
        baseURL: BASE_URL,
        headers: undefined,
      });
    });

    it('should handle request with query parameters', async () => {
      vi.mocked(axios).mockResolvedValue({ data: [], status: 200 });

      const config = {
        method: 'GET',
        url: '/api/items',
        params: { page: 0, size: 10 },
      };

      await requestBackend(config);

      expect(axios).toHaveBeenCalledWith({
        ...config,
        baseURL: BASE_URL,
        headers: undefined,
      });
    });

    it('should propagate axios errors', async () => {
      const error = new Error('Network Error');
      vi.mocked(axios).mockRejectedValue(error);

      const config = {
        method: 'GET',
        url: '/api/error',
      };

      await expect(requestBackend(config)).rejects.toThrow('Network Error');
    });

    it('should handle null authorization token', async () => {
      vi.mocked(authService.getAccessToken).mockReturnValue(null as any);
      vi.mocked(axios).mockResolvedValue({ data: {}, status: 200 });

      const config = {
        method: 'GET',
        url: '/api/test',
        withCredentials: true,
      };

      await requestBackend(config);

      expect(axios).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/test',
        baseURL: BASE_URL,
        withCredentials: true,
        headers: {
          Authorization: 'Bearer null',
        },
      });
    });

    it('should handle empty config headers', async () => {
      vi.mocked(axios).mockResolvedValue({ data: {}, status: 200 });

      const config = {
        method: 'GET',
        url: '/api/test',
      };

      await requestBackend(config);

      expect(axios).toHaveBeenCalledWith({
        ...config,
        baseURL: BASE_URL,
        headers: undefined,
      });
    });
  });
});
