import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockUseNavigate, mockUseParams, mockUseLocation } from './routerMock';
import * as ReactRouter from 'react-router-dom';

vi.mock('react-router-dom');

describe('Router Mock Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('mockUseNavigate', () => {
    it('should return a mock navigate function', () => {
      const navigate = mockUseNavigate();

      expect(navigate).toBeDefined();
      expect(typeof navigate).toBe('function');
    });

    it('should allow calling navigate with path', () => {
      const navigate = mockUseNavigate();

      navigate('/home');

      expect(navigate).toHaveBeenCalledWith('/home');
    });

    it('should allow calling navigate with options', () => {
      const navigate = mockUseNavigate();

      navigate('/home', { replace: true });

      expect(navigate).toHaveBeenCalledWith('/home', { replace: true });
    });

    it('should work with negative navigation', () => {
      const navigate = mockUseNavigate();

      navigate(-1);

      expect(navigate).toHaveBeenCalledWith(-1);
    });
  });

  describe('mockUseParams', () => {
    it('should mock useParams with provided parameters', () => {
      const params = { id: '123', category: 'test' };
      mockUseParams(params);

      const result = ReactRouter.useParams();

      expect(result).toEqual(params);
    });

    it('should mock useParams with single parameter', () => {
      mockUseParams({ id: '456' });

      const result = ReactRouter.useParams();

      expect(result).toEqual({ id: '456' });
    });

    it('should mock useParams with empty params', () => {
      mockUseParams({});

      const result = ReactRouter.useParams();

      expect(result).toEqual({});
    });
  });

  describe('mockUseLocation', () => {
    it('should mock useLocation with pathname', () => {
      mockUseLocation({ pathname: '/test' });

      const result = ReactRouter.useLocation();

      expect(result.pathname).toBe('/test');
    });

    it('should mock useLocation with search params', () => {
      mockUseLocation({ pathname: '/test', search: '?query=value' });

      const result = ReactRouter.useLocation();

      expect(result.pathname).toBe('/test');
      expect(result.search).toBe('?query=value');
    });

    it('should mock useLocation with state', () => {
      const state = { from: '/previous' };
      mockUseLocation({ pathname: '/current', state });

      const result = ReactRouter.useLocation();

      expect(result.pathname).toBe('/current');
      expect(result.state).toEqual(state);
    });

    it('should provide default location properties', () => {
      mockUseLocation({ pathname: '/test' });

      const result = ReactRouter.useLocation();

      expect(result).toHaveProperty('pathname');
      expect(result).toHaveProperty('search');
      expect(result).toHaveProperty('hash');
      expect(result).toHaveProperty('state');
    });
  });
});
