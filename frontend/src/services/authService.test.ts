import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import * as authService from './authService';
import * as requests from '../utils/requests';
import * as accessTokenRepository from '../localstorage/access-token-repository';
import { CLIENT_ID, CLIENT_SECRET } from '../utils/system';
import jwtDecode from 'jwt-decode';
import { CredentialsDTO } from '../models/auth';

vi.mock('../utils/requests');
vi.mock('../localstorage/access-token-repository');
vi.mock('jwt-decode');

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loginRequest', () => {
    it('should send POST request to /oauth2/token endpoint', async () => {
      const mockResponse = { data: { access_token: 'token123' } };
      vi.mocked(requests.requestBackend).mockResolvedValue(mockResponse);

      const credentials: CredentialsDTO = {
        username: 'testuser',
        password: 'password123',
      };

      await authService.loginRequest(credentials);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/oauth2/token',
        })
      );
    });

    it('should include Basic auth header with CLIENT_ID and CLIENT_SECRET', async () => {
      const mockResponse = { data: { access_token: 'token123' } };
      vi.mocked(requests.requestBackend).mockResolvedValue(mockResponse);

      const credentials: CredentialsDTO = {
        username: 'testuser',
        password: 'password123',
      };

      await authService.loginRequest(credentials);

      const expectedAuth = 'Basic ' + window.btoa(CLIENT_ID + ':' + CLIENT_SECRET);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expectedAuth,
          }),
        })
      );
    });

    it('should include Content-Type application/x-www-form-urlencoded header', async () => {
      const mockResponse = { data: { access_token: 'token123' } };
      vi.mocked(requests.requestBackend).mockResolvedValue(mockResponse);

      const credentials: CredentialsDTO = {
        username: 'testuser',
        password: 'password123',
      };

      await authService.loginRequest(credentials);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
        })
      );
    });

    it('should include grant_type=password in request body', async () => {
      const mockResponse = { data: { access_token: 'token123' } };
      vi.mocked(requests.requestBackend).mockResolvedValue(mockResponse);

      const credentials: CredentialsDTO = {
        username: 'testuser',
        password: 'password123',
      };

      await authService.loginRequest(credentials);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.stringContaining('grant_type=password'),
        })
      );
    });

    it('should include username in request body', async () => {
      const mockResponse = { data: { access_token: 'token123' } };
      vi.mocked(requests.requestBackend).mockResolvedValue(mockResponse);

      const credentials: CredentialsDTO = {
        username: 'testuser',
        password: 'password123',
      };

      await authService.loginRequest(credentials);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.stringContaining('username=testuser'),
        })
      );
    });

    it('should include password in request body', async () => {
      const mockResponse = { data: { access_token: 'token123' } };
      vi.mocked(requests.requestBackend).mockResolvedValue(mockResponse);

      const credentials: CredentialsDTO = {
        username: 'testuser',
        password: 'password123',
      };

      await authService.loginRequest(credentials);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.stringContaining('password=password123'),
        })
      );
    });

    it('should return response from requestBackend', async () => {
      const mockResponse = { data: { access_token: 'token123', expires_in: 3600 } };
      vi.mocked(requests.requestBackend).mockResolvedValue(mockResponse);

      const credentials: CredentialsDTO = {
        username: 'testuser',
        password: 'password123',
      };

      const result = await authService.loginRequest(credentials);

      expect(result).toEqual(mockResponse);
    });

    it('should handle login failure errors', async () => {
      const mockError = new Error('Invalid credentials');
      vi.mocked(requests.requestBackend).mockRejectedValue(mockError);

      const credentials: CredentialsDTO = {
        username: 'wronguser',
        password: 'wrongpass',
      };

      await expect(authService.loginRequest(credentials)).rejects.toThrow('Invalid credentials');
    });

    it('should properly encode request body as URL-encoded string', async () => {
      const mockResponse = { data: { access_token: 'token123' } };
      vi.mocked(requests.requestBackend).mockResolvedValue(mockResponse);

      const credentials: CredentialsDTO = {
        username: 'user@test.com',
        password: 'pass word',
      };

      await authService.loginRequest(credentials);

      const call = vi.mocked(requests.requestBackend).mock.calls[0][0];
      expect(typeof call.data).toBe('string');
      expect(call.data).toContain('username=');
      expect(call.data).toContain('password=');
      expect(call.data).toContain('grant_type=');
    });
  });

  describe('logout', () => {
    it('should call accessTokenRepository.remove', () => {
      authService.logout();

      expect(accessTokenRepository.remove).toHaveBeenCalled();
    });

    it('should call remove exactly once', () => {
      authService.logout();

      expect(accessTokenRepository.remove).toHaveBeenCalledTimes(1);
    });

    it('should not throw error when removing token', () => {
      expect(() => authService.logout()).not.toThrow();
    });
  });

  describe('saveAccessToken', () => {
    it('should call accessTokenRepository.save with token', () => {
      const token = 'test-token-123';

      authService.saveAccessToken(token);

      expect(accessTokenRepository.save).toHaveBeenCalledWith(token);
    });

    it('should save empty string token', () => {
      authService.saveAccessToken('');

      expect(accessTokenRepository.save).toHaveBeenCalledWith('');
    });

    it('should save long token string', () => {
      const longToken = 'a'.repeat(1000);

      authService.saveAccessToken(longToken);

      expect(accessTokenRepository.save).toHaveBeenCalledWith(longToken);
    });
  });

  describe('getAccessToken', () => {
    it('should return token from accessTokenRepository', () => {
      const mockToken = 'stored-token-456';
      vi.mocked(accessTokenRepository.get).mockReturnValue(mockToken);

      const result = authService.getAccessToken();

      expect(result).toBe(mockToken);
    });

    it('should return null when no token stored', () => {
      vi.mocked(accessTokenRepository.get).mockReturnValue(null);

      const result = authService.getAccessToken();

      expect(result).toBeNull();
    });

    it('should call accessTokenRepository.get', () => {
      vi.mocked(accessTokenRepository.get).mockReturnValue('token');

      authService.getAccessToken();

      expect(accessTokenRepository.get).toHaveBeenCalled();
    });
  });

  describe('getAccessTokenPayload', () => {
    it('should decode valid JWT token', () => {
      const mockToken = 'valid.jwt.token';
      const mockPayload = {
        exp: Math.floor(Date.now() / 1000) + 3600,
        username: 'testuser',
        authorities: ['ROLE_OPERATOR'],
      };

      vi.mocked(accessTokenRepository.get).mockReturnValue(mockToken);
      vi.mocked(jwtDecode).mockReturnValue(mockPayload);

      const result = authService.getAccessTokenPayload();

      expect(result).toEqual(mockPayload);
      expect(jwtDecode).toHaveBeenCalledWith(mockToken);
    });

    it('should return undefined when token is null', () => {
      vi.mocked(accessTokenRepository.get).mockReturnValue(null);

      const result = authService.getAccessTokenPayload();

      expect(result).toBeUndefined();
      expect(jwtDecode).not.toHaveBeenCalled();
    });

    it('should return undefined when decoding fails', () => {
      const mockToken = 'invalid.token';
      vi.mocked(accessTokenRepository.get).mockReturnValue(mockToken);
      vi.mocked(jwtDecode).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = authService.getAccessTokenPayload();

      expect(result).toBeUndefined();
    });

    it('should handle malformed JWT tokens', () => {
      vi.mocked(accessTokenRepository.get).mockReturnValue('not-a-jwt');
      vi.mocked(jwtDecode).mockImplementation(() => {
        throw new Error('Malformed JWT');
      });

      const result = authService.getAccessTokenPayload();

      expect(result).toBeUndefined();
    });

    it('should extract all token payload fields', () => {
      const mockToken = 'valid.jwt.token';
      const mockPayload = {
        exp: 1700000000,
        username: 'admin',
        authorities: ['ROLE_ADMIN', 'ROLE_ANALYST'],
      };

      vi.mocked(accessTokenRepository.get).mockReturnValue(mockToken);
      vi.mocked(jwtDecode).mockReturnValue(mockPayload);

      const result = authService.getAccessTokenPayload();

      expect(result?.exp).toBe(1700000000);
      expect(result?.username).toBe('admin');
      expect(result?.authorities).toEqual(['ROLE_ADMIN', 'ROLE_ANALYST']);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true for valid non-expired token', () => {
      const mockPayload = {
        exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
        username: 'testuser',
        authorities: ['ROLE_OPERATOR'],
      };

      vi.mocked(accessTokenRepository.get).mockReturnValue('valid.token');
      vi.mocked(jwtDecode).mockReturnValue(mockPayload);

      const result = authService.isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false for expired token', () => {
      const mockPayload = {
        exp: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
        username: 'testuser',
        authorities: ['ROLE_OPERATOR'],
      };

      vi.mocked(accessTokenRepository.get).mockReturnValue('expired.token');
      vi.mocked(jwtDecode).mockReturnValue(mockPayload);

      const result = authService.isAuthenticated();

      expect(result).toBe(false);
    });

    it('should return false when no token exists', () => {
      vi.mocked(accessTokenRepository.get).mockReturnValue(null);

      const result = authService.isAuthenticated();

      expect(result).toBe(false);
    });

    it('should return false when token decoding fails', () => {
      vi.mocked(accessTokenRepository.get).mockReturnValue('invalid.token');
      vi.mocked(jwtDecode).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = authService.isAuthenticated();

      expect(result).toBe(false);
    });

    it('should compare token expiration with current time in milliseconds', () => {
      const now = Date.now();
      const mockPayload = {
        exp: Math.floor(now / 1000) + 60, // Expires in 60 seconds
        username: 'testuser',
        authorities: ['ROLE_OPERATOR'],
      };

      vi.mocked(accessTokenRepository.get).mockReturnValue('valid.token');
      vi.mocked(jwtDecode).mockReturnValue(mockPayload);

      const result = authService.isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false for token expiring at current timestamp', () => {
      const now = Date.now();
      const mockPayload = {
        exp: Math.floor(now / 1000), // Expires now
        username: 'testuser',
        authorities: ['ROLE_OPERATOR'],
      };

      vi.mocked(accessTokenRepository.get).mockReturnValue('expiring.token');
      vi.mocked(jwtDecode).mockReturnValue(mockPayload);

      const result = authService.isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe('hasAnyRoles', () => {
    it('should return true when user has one of the required roles', () => {
      const mockPayload = {
        exp: Math.floor(Date.now() / 1000) + 3600,
        username: 'testuser',
        authorities: ['ROLE_OPERATOR', 'ROLE_ANALYST'],
      };

      vi.mocked(accessTokenRepository.get).mockReturnValue('valid.token');
      vi.mocked(jwtDecode).mockReturnValue(mockPayload);

      const result = authService.hasAnyRoles(['ROLE_OPERATOR']);

      expect(result).toBe(true);
    });

    it('should return true when user has multiple matching roles', () => {
      const mockPayload = {
        exp: Math.floor(Date.now() / 1000) + 3600,
        username: 'admin',
        authorities: ['ROLE_ADMIN', 'ROLE_ANALYST', 'ROLE_OPERATOR'],
      };

      vi.mocked(accessTokenRepository.get).mockReturnValue('valid.token');
      vi.mocked(jwtDecode).mockReturnValue(mockPayload);

      const result = authService.hasAnyRoles(['ROLE_ADMIN', 'ROLE_ANALYST']);

      expect(result).toBe(true);
    });

    it('should return false when user has none of the required roles', () => {
      const mockPayload = {
        exp: Math.floor(Date.now() / 1000) + 3600,
        username: 'testuser',
        authorities: ['ROLE_OPERATOR'],
      };

      vi.mocked(accessTokenRepository.get).mockReturnValue('valid.token');
      vi.mocked(jwtDecode).mockReturnValue(mockPayload);

      const result = authService.hasAnyRoles(['ROLE_ADMIN']);

      expect(result).toBe(false);
    });

    it('should return true when roles array is empty', () => {
      const mockPayload = {
        exp: Math.floor(Date.now() / 1000) + 3600,
        username: 'testuser',
        authorities: ['ROLE_OPERATOR'],
      };

      vi.mocked(accessTokenRepository.get).mockReturnValue('valid.token');
      vi.mocked(jwtDecode).mockReturnValue(mockPayload);

      const result = authService.hasAnyRoles([]);

      expect(result).toBe(true);
    });

    it('should return false when no token exists', () => {
      vi.mocked(accessTokenRepository.get).mockReturnValue(null);

      const result = authService.hasAnyRoles(['ROLE_OPERATOR']);

      expect(result).toBe(false);
    });

    it('should return false when token is invalid', () => {
      vi.mocked(accessTokenRepository.get).mockReturnValue('invalid.token');
      vi.mocked(jwtDecode).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = authService.hasAnyRoles(['ROLE_OPERATOR']);

      expect(result).toBe(false);
    });

    it('should handle case-sensitive role comparison', () => {
      const mockPayload = {
        exp: Math.floor(Date.now() / 1000) + 3600,
        username: 'testuser',
        authorities: ['ROLE_OPERATOR'],
      };

      vi.mocked(accessTokenRepository.get).mockReturnValue('valid.token');
      vi.mocked(jwtDecode).mockReturnValue(mockPayload);

      const result = authService.hasAnyRoles(['role_operator' as any]);

      expect(result).toBe(false);
    });

    it('should check all roles in array until match found', () => {
      const mockPayload = {
        exp: Math.floor(Date.now() / 1000) + 3600,
        username: 'testuser',
        authorities: ['ROLE_ANALYST'],
      };

      vi.mocked(accessTokenRepository.get).mockReturnValue('valid.token');
      vi.mocked(jwtDecode).mockReturnValue(mockPayload);

      const result = authService.hasAnyRoles(['ROLE_ADMIN', 'ROLE_ANALYST', 'ROLE_OPERATOR']);

      expect(result).toBe(true);
    });

    it('should handle user with no authorities', () => {
      const mockPayload = {
        exp: Math.floor(Date.now() / 1000) + 3600,
        username: 'testuser',
        authorities: [],
      };

      vi.mocked(accessTokenRepository.get).mockReturnValue('valid.token');
      vi.mocked(jwtDecode).mockReturnValue(mockPayload);

      const result = authService.hasAnyRoles(['ROLE_OPERATOR']);

      expect(result).toBe(false);
    });
  });
});
