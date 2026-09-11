import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useContext, useState } from 'react';
import { ContextToken, ContextTokenType } from './context-token';
import { AccessTokenPayloadDTO } from '../models/auth';

describe('Context Token Utility', () => {
  describe('ContextToken', () => {
    it('should be defined as a React context', () => {
      expect(ContextToken).toBeDefined();
      expect(ContextToken.Provider).toBeDefined();
      expect(ContextToken.Consumer).toBeDefined();
    });

    it('should have default contextTokenPayload as undefined', () => {
      const { result } = renderHook(() => useContext(ContextToken));

      expect(result.current.contextTokenPayload).toBeUndefined();
    });

    it('should have default setContextTokenPayload as a function', () => {
      const { result } = renderHook(() => useContext(ContextToken));

      expect(typeof result.current.setContextTokenPayload).toBe('function');
    });

    it('should not throw when calling default setContextTokenPayload', () => {
      const { result } = renderHook(() => useContext(ContextToken));

      expect(() => {
        result.current.setContextTokenPayload(undefined);
      }).not.toThrow();
    });

    it('should accept AccessTokenPayloadDTO in context', () => {
      const mockPayload: AccessTokenPayloadDTO = {
        exp: Math.floor(Date.now() / 1000) + 3600,
        username: 'testuser',
        authorities: ['ROLE_OPERATOR'],
      };

      const TestProvider = ({ children }: { children: React.ReactNode }) => {
        const [contextTokenPayload, setContextTokenPayload] = useState<
          AccessTokenPayloadDTO | undefined
        >(mockPayload);

        const value: ContextTokenType = {
          contextTokenPayload,
          setContextTokenPayload,
        };

        return <ContextToken.Provider value={value}>{children}</ContextToken.Provider>;
      };

      const { result } = renderHook(() => useContext(ContextToken), {
        wrapper: TestProvider,
      });

      expect(result.current.contextTokenPayload).toEqual(mockPayload);
    });

    it('should allow updating contextTokenPayload via setContextTokenPayload', () => {
      const initialPayload: AccessTokenPayloadDTO = {
        exp: Math.floor(Date.now() / 1000) + 3600,
        username: 'user1',
        authorities: ['ROLE_OPERATOR'],
      };

      const updatedPayload: AccessTokenPayloadDTO = {
        exp: Math.floor(Date.now() / 1000) + 7200,
        username: 'user2',
        authorities: ['ROLE_ADMIN'],
      };

      const TestProvider = ({ children }: { children: React.ReactNode }) => {
        const [contextTokenPayload, setContextTokenPayload] = useState<
          AccessTokenPayloadDTO | undefined
        >(initialPayload);

        const value: ContextTokenType = {
          contextTokenPayload,
          setContextTokenPayload,
        };

        return <ContextToken.Provider value={value}>{children}</ContextToken.Provider>;
      };

      const { result } = renderHook(() => useContext(ContextToken), {
        wrapper: TestProvider,
      });

      expect(result.current.contextTokenPayload).toEqual(initialPayload);

      act(() => {
        result.current.setContextTokenPayload(updatedPayload);
      });

      expect(result.current.contextTokenPayload).toEqual(updatedPayload);
    });

    it('should allow clearing contextTokenPayload by setting to undefined', () => {
      const initialPayload: AccessTokenPayloadDTO = {
        exp: Math.floor(Date.now() / 1000) + 3600,
        username: 'testuser',
        authorities: ['ROLE_OPERATOR'],
      };

      const TestProvider = ({ children }: { children: React.ReactNode }) => {
        const [contextTokenPayload, setContextTokenPayload] = useState<
          AccessTokenPayloadDTO | undefined
        >(initialPayload);

        const value: ContextTokenType = {
          contextTokenPayload,
          setContextTokenPayload,
        };

        return <ContextToken.Provider value={value}>{children}</ContextToken.Provider>;
      };

      const { result } = renderHook(() => useContext(ContextToken), {
        wrapper: TestProvider,
      });

      expect(result.current.contextTokenPayload).toEqual(initialPayload);

      act(() => {
        result.current.setContextTokenPayload(undefined);
      });

      expect(result.current.contextTokenPayload).toBeUndefined();
    });

    it('should maintain type safety for ContextTokenType', () => {
      const TestProvider = ({ children }: { children: React.ReactNode }) => {
        const [contextTokenPayload, setContextTokenPayload] = useState<
          AccessTokenPayloadDTO | undefined
        >(undefined);

        const value: ContextTokenType = {
          contextTokenPayload,
          setContextTokenPayload,
        };

        return <ContextToken.Provider value={value}>{children}</ContextToken.Provider>;
      };

      const { result } = renderHook(() => useContext(ContextToken), {
        wrapper: TestProvider,
      });

      expect(result.current).toHaveProperty('contextTokenPayload');
      expect(result.current).toHaveProperty('setContextTokenPayload');
    });

    it('should handle multiple state updates in sequence', () => {
      const payload1: AccessTokenPayloadDTO = {
        exp: Math.floor(Date.now() / 1000) + 3600,
        username: 'user1',
        authorities: ['ROLE_OPERATOR'],
      };

      const payload2: AccessTokenPayloadDTO = {
        exp: Math.floor(Date.now() / 1000) + 7200,
        username: 'user2',
        authorities: ['ROLE_ANALYST'],
      };

      const payload3: AccessTokenPayloadDTO = {
        exp: Math.floor(Date.now() / 1000) + 10800,
        username: 'user3',
        authorities: ['ROLE_ADMIN'],
      };

      const TestProvider = ({ children }: { children: React.ReactNode }) => {
        const [contextTokenPayload, setContextTokenPayload] = useState<
          AccessTokenPayloadDTO | undefined
        >(undefined);

        const value: ContextTokenType = {
          contextTokenPayload,
          setContextTokenPayload,
        };

        return <ContextToken.Provider value={value}>{children}</ContextToken.Provider>;
      };

      const { result } = renderHook(() => useContext(ContextToken), {
        wrapper: TestProvider,
      });

      expect(result.current.contextTokenPayload).toBeUndefined();

      act(() => {
        result.current.setContextTokenPayload(payload1);
      });
      expect(result.current.contextTokenPayload).toEqual(payload1);

      act(() => {
        result.current.setContextTokenPayload(payload2);
      });
      expect(result.current.contextTokenPayload).toEqual(payload2);

      act(() => {
        result.current.setContextTokenPayload(payload3);
      });
      expect(result.current.contextTokenPayload).toEqual(payload3);

      act(() => {
        result.current.setContextTokenPayload(undefined);
      });
      expect(result.current.contextTokenPayload).toBeUndefined();
    });

    it('should support different authority combinations', () => {
      const payloadWithMultipleRoles: AccessTokenPayloadDTO = {
        exp: Math.floor(Date.now() / 1000) + 3600,
        username: 'admin',
        authorities: ['ROLE_ADMIN', 'ROLE_ANALYST', 'ROLE_OPERATOR'],
      };

      const TestProvider = ({ children }: { children: React.ReactNode }) => {
        const [contextTokenPayload, setContextTokenPayload] = useState<
          AccessTokenPayloadDTO | undefined
        >(payloadWithMultipleRoles);

        const value: ContextTokenType = {
          contextTokenPayload,
          setContextTokenPayload,
        };

        return <ContextToken.Provider value={value}>{children}</ContextToken.Provider>;
      };

      const { result } = renderHook(() => useContext(ContextToken), {
        wrapper: TestProvider,
      });

      expect(result.current.contextTokenPayload?.authorities).toHaveLength(3);
      expect(result.current.contextTokenPayload?.authorities).toContain('ROLE_ADMIN');
      expect(result.current.contextTokenPayload?.authorities).toContain('ROLE_ANALYST');
      expect(result.current.contextTokenPayload?.authorities).toContain('ROLE_OPERATOR');
    });

    it('should handle expired token payload', () => {
      const expiredPayload: AccessTokenPayloadDTO = {
        exp: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
        username: 'expireduser',
        authorities: ['ROLE_OPERATOR'],
      };

      const TestProvider = ({ children }: { children: React.ReactNode }) => {
        const [contextTokenPayload, setContextTokenPayload] = useState<
          AccessTokenPayloadDTO | undefined
        >(expiredPayload);

        const value: ContextTokenType = {
          contextTokenPayload,
          setContextTokenPayload,
        };

        return <ContextToken.Provider value={value}>{children}</ContextToken.Provider>;
      };

      const { result } = renderHook(() => useContext(ContextToken), {
        wrapper: TestProvider,
      });

      expect(result.current.contextTokenPayload).toEqual(expiredPayload);
      expect(result.current.contextTokenPayload?.exp).toBeLessThan(
        Math.floor(Date.now() / 1000)
      );
    });

    it('should support nested provider pattern', () => {
      const outerPayload: AccessTokenPayloadDTO = {
        exp: Math.floor(Date.now() / 1000) + 3600,
        username: 'outeruser',
        authorities: ['ROLE_OPERATOR'],
      };

      const innerPayload: AccessTokenPayloadDTO = {
        exp: Math.floor(Date.now() / 1000) + 7200,
        username: 'inneruser',
        authorities: ['ROLE_ADMIN'],
      };

      const OuterProvider = ({ children }: { children: React.ReactNode }) => {
        const [contextTokenPayload, setContextTokenPayload] = useState<
          AccessTokenPayloadDTO | undefined
        >(outerPayload);

        const value: ContextTokenType = {
          contextTokenPayload,
          setContextTokenPayload,
        };

        return <ContextToken.Provider value={value}>{children}</ContextToken.Provider>;
      };

      const InnerProvider = ({ children }: { children: React.ReactNode }) => {
        const [contextTokenPayload, setContextTokenPayload] = useState<
          AccessTokenPayloadDTO | undefined
        >(innerPayload);

        const value: ContextTokenType = {
          contextTokenPayload,
          setContextTokenPayload,
        };

        return <ContextToken.Provider value={value}>{children}</ContextToken.Provider>;
      };

      const { result } = renderHook(() => useContext(ContextToken), {
        wrapper: ({ children }) => (
          <OuterProvider>
            <InnerProvider>{children}</InnerProvider>
          </OuterProvider>
        ),
      });

      // Inner provider should take precedence
      expect(result.current.contextTokenPayload).toEqual(innerPayload);
    });
  });
});
