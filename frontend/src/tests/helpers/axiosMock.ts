import { vi } from 'vitest';
import * as requests from '../../utils/requests';
import { createMockAxiosResponse, createMockAxiosError } from './mockFactories';

/**
 * Mock a GET request with response data and optional status code
 */
export function mockAxiosGet<T>(
  url: string,
  response: T,
  status: number = 200
): void {
  vi.mocked(requests.requestBackend).mockResolvedValueOnce(
    createMockAxiosResponse(response, status)
  );
}

/**
 * Mock a POST request with response data and optional status code
 */
export function mockAxiosPost<T>(
  url: string,
  response: T,
  status: number = 200
): void {
  vi.mocked(requests.requestBackend).mockResolvedValueOnce(
    createMockAxiosResponse(response, status)
  );
}

/**
 * Mock a PUT request with response data and optional status code
 */
export function mockAxiosPut<T>(
  url: string,
  response: T,
  status: number = 200
): void {
  vi.mocked(requests.requestBackend).mockResolvedValueOnce(
    createMockAxiosResponse(response, status)
  );
}

/**
 * Mock a DELETE request with response data and optional status code
 */
export function mockAxiosDelete<T>(
  url: string,
  response: T,
  status: number = 200
): void {
  vi.mocked(requests.requestBackend).mockResolvedValueOnce(
    createMockAxiosResponse(response, status)
  );
}

/**
 * Mock an axios error with specific status code and message
 */
export function mockAxiosError(
  url: string,
  message: string,
  status: number
): void {
  const error = createMockAxiosError(message, status);
  vi.mocked(requests.requestBackend).mockRejectedValueOnce(error);
}

/**
 * Clear all axios mocks
 */
export function clearAllAxiosMocks(): void {
  vi.clearAllMocks();
}
