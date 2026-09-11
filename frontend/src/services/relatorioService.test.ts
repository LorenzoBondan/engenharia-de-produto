import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as relatorioService from './relatorioService';
import * as requests from '../utils/requests';
import { createMockAxiosResponse } from '../tests/helpers/mockFactories';


vi.mock('../utils/requests');

describe('RelatorioService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('gerarRelatorioPdf', () => {
    it('should send GET request to /api/relatorio/:id', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(new Blob()));

      await relatorioService.gerarRelatorioPdf(123);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/relatorio/123',
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(new Blob()));

      await relatorioService.gerarRelatorioPdf(123);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should set responseType to blob', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(new Blob()));

      await relatorioService.gerarRelatorioPdf(123);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          responseType: 'blob',
        })
      );
    });

    it('should handle different relatorio IDs', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(new Blob()));

      await relatorioService.gerarRelatorioPdf(456);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/relatorio/456',
        })
      );
    });

    it('should handle ID 1', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(new Blob()));

      await relatorioService.gerarRelatorioPdf(1);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/relatorio/1',
        })
      );
    });

    it('should handle large ID numbers', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(new Blob()));

      await relatorioService.gerarRelatorioPdf(999999);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/relatorio/999999',
        })
      );
    });

    it('should call requestBackend with complete config', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(new Blob()));

      await relatorioService.gerarRelatorioPdf(789);

      expect(requests.requestBackend).toHaveBeenCalledWith({
        url: '/api/relatorio/789',
        withCredentials: true,
        responseType: 'blob',
      });
    });

    it('should be called exactly once', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(new Blob()));

      await relatorioService.gerarRelatorioPdf(123);

      expect(requests.requestBackend).toHaveBeenCalledTimes(1);
    });

    it('should return the response from requestBackend', async () => {
      const mockBlob = new Blob(['test data'], { type: 'application/pdf' });
      const mockResponse = { data: mockBlob };
      vi.mocked(requests.requestBackend).mockResolvedValue(mockResponse);

      const result = await relatorioService.gerarRelatorioPdf(123);

      expect(result).toBe(mockResponse);
    });

    it('should handle error from requestBackend', async () => {
      const mockError = new Error('Network error');
      vi.mocked(requests.requestBackend).mockRejectedValue(mockError);

      await expect(relatorioService.gerarRelatorioPdf(123)).rejects.toThrow('Network error');
    });

    it('should handle zero ID', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(new Blob()));

      await relatorioService.gerarRelatorioPdf(0);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/relatorio/0',
        })
      );
    });

    it('should preserve all config properties', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(new Blob()));

      await relatorioService.gerarRelatorioPdf(100);

      const callArgs = vi.mocked(requests.requestBackend).mock.calls[0][0];
      expect(callArgs).toHaveProperty('url');
      expect(callArgs).toHaveProperty('withCredentials');
      expect(callArgs).toHaveProperty('responseType');
    });

    it('should not include method property in config', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(new Blob()));

      await relatorioService.gerarRelatorioPdf(123);

      const callArgs = vi.mocked(requests.requestBackend).mock.calls[0][0];
      expect(callArgs).not.toHaveProperty('method');
    });

    it('should not include params property in config', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(new Blob()));

      await relatorioService.gerarRelatorioPdf(123);

      const callArgs = vi.mocked(requests.requestBackend).mock.calls[0][0];
      expect(callArgs).not.toHaveProperty('params');
    });

    it('should not include data property in config', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(new Blob()));

      await relatorioService.gerarRelatorioPdf(123);

      const callArgs = vi.mocked(requests.requestBackend).mock.calls[0][0];
      expect(callArgs).not.toHaveProperty('data');
    });
  });
});
