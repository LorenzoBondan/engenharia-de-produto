import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { AccessTokenPayloadDTO } from '../../models/auth';

export type RoleEnum = 'ROLE_ADMIN' | 'ROLE_ANALYST' | 'ROLE_OPERATOR';

export interface MockUser {
  id: number;
  username: string;
  email: string;
  roles: RoleEnum[];
  active: boolean;
}

export interface MockPaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface MockAxiosError {
  message: string;
  response?: {
    data: any;
    status: number;
    statusText: string;
  };
  request?: any;
  config?: AxiosRequestConfig;
}

/**
 * Creates a mock user object with configurable properties
 */
export function createMockUser(overrides?: Partial<MockUser>): MockUser {
  return {
    id: 1,
    username: 'testuser',
    email: 'test@test.com',
    roles: ['ROLE_OPERATOR'],
    active: true,
    ...overrides,
  };
}

/**
 * Creates a mock access token payload with expiration and role data
 */
export function createMockAccessToken(
  overrides?: Partial<AccessTokenPayloadDTO>
): AccessTokenPayloadDTO {
  const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

  return {
    exp: futureExp,
    username: 'testuser',
    authorities: ['ROLE_OPERATOR'],
    ...overrides,
  };
}

/**
 * Creates a mock axios response with data and status code
 */
export function createMockAxiosResponse<T>(
  data: T,
  status: number = 200
): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: status === 200 ? 'OK' : status === 201 ? 'Created' : 'Success',
    headers: {},
    config: {
      headers: {} as any,
    },
  };
}

/**
 * Creates a mock axios error with message and status code
 */
export function createMockAxiosError(
  message: string,
  status?: number
): MockAxiosError {
  const error: MockAxiosError = {
    message,
    response: status
      ? {
          data: { message },
          status,
          statusText: getStatusText(status),
        }
      : undefined,
  };

  return error;
}

/**
 * Creates a mock paginated response with page metadata
 */
export function createMockPaginatedResponse<T>(
  content: T[],
  page: number,
  size: number,
  last: boolean
): MockPaginatedResponse<T> {
  const totalElements = content.length;
  const totalPages = totalElements > 0 ? Math.ceil(totalElements / size) : 0;

  return {
    content,
    page,
    size,
    totalElements,
    totalPages,
    last,
    first: page === 0,
  };
}

/**
 * Helper function to get HTTP status text
 */
function getStatusText(status: number): string {
  const statusTexts: Record<number, string> = {
    200: 'OK',
    201: 'Created',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
  };

  return statusTexts[status] || 'Unknown';
}
