import { describe, it, expect, beforeEach } from 'vitest';
import { history } from './history';

describe('History Utility', () => {
  beforeEach(() => {
    // Reset history to initial state
    history.replace('/');
  });

  describe('history', () => {
    it('should be defined', () => {
      expect(history).toBeDefined();
    });

    it('should have push method', () => {
      expect(typeof history.push).toBe('function');
    });

    it('should have replace method', () => {
      expect(typeof history.replace).toBe('function');
    });

    it('should have go method', () => {
      expect(typeof history.go).toBe('function');
    });

    it('should have back method', () => {
      expect(typeof history.back).toBe('function');
    });

    it('should have forward method', () => {
      expect(typeof history.forward).toBe('function');
    });

    it('should have listen method', () => {
      expect(typeof history.listen).toBe('function');
    });

    it('should have location property', () => {
      expect(history.location).toBeDefined();
    });

    it('should have action property', () => {
      expect(history.action).toBeDefined();
    });

    it('should push new location', () => {
      history.push('/test');
      expect(history.location.pathname).toBe('/test');
    });

    it('should replace current location', () => {
      history.push('/first');
      expect(history.location.pathname).toBe('/first');

      history.replace('/second');
      expect(history.location.pathname).toBe('/second');
    });

    it('should handle push with state', () => {
      const state = { data: 'test-data' };
      history.push('/with-state', state);

      expect(history.location.pathname).toBe('/with-state');
      expect(history.location.state).toEqual(state);
    });

    it('should handle replace with state', () => {
      const state = { key: 'value' };
      history.replace('/replace-with-state', state);

      expect(history.location.pathname).toBe('/replace-with-state');
      expect(history.location.state).toEqual(state);
    });

    it('should navigate with query parameters', () => {
      history.push('/search?q=test&page=1');

      expect(history.location.pathname).toBe('/search');
      expect(history.location.search).toBe('?q=test&page=1');
    });

    it('should navigate with hash', () => {
      history.push('/page#section');

      expect(history.location.pathname).toBe('/page');
      expect(history.location.hash).toBe('#section');
    });

    it('should handle complex paths', () => {
      history.push('/users/123/profile');

      expect(history.location.pathname).toBe('/users/123/profile');
    });

    it('should update action on push', () => {
      history.push('/new-page');

      expect(history.action).toBe('PUSH');
    });

    it('should update action on replace', () => {
      history.replace('/replaced');

      expect(history.action).toBe('REPLACE');
    });

    it('should call listeners when location changes', () => {
      let called = false;
      let newLocation = null;

      const unsubscribe = history.listen(({ location }) => {
        called = true;
        newLocation = location;
      });

      history.push('/listener-test');

      expect(called).toBe(true);
      expect(newLocation).toBeDefined();
      expect((newLocation as any).pathname).toBe('/listener-test');

      unsubscribe();
    });

    it('should stop calling listeners after unsubscribe', () => {
      let callCount = 0;

      const unsubscribe = history.listen(() => {
        callCount++;
      });

      history.push('/first');
      expect(callCount).toBe(1);

      unsubscribe();

      history.push('/second');
      expect(callCount).toBe(1); // Should not increase
    });

    it('should handle multiple listeners', () => {
      let listener1Called = false;
      let listener2Called = false;

      const unsubscribe1 = history.listen(() => {
        listener1Called = true;
      });

      const unsubscribe2 = history.listen(() => {
        listener2Called = true;
      });

      history.push('/multi-listener');

      expect(listener1Called).toBe(true);
      expect(listener2Called).toBe(true);

      unsubscribe1();
      unsubscribe2();
    });

    it('should preserve location key', () => {
      history.push('/page1');
      const key1 = history.location.key;

      expect(key1).toBeDefined();
      expect(typeof key1).toBe('string');
    });

    it('should handle root path', () => {
      history.push('/');

      expect(history.location.pathname).toBe('/');
    });

    it('should handle paths with trailing slash', () => {
      history.push('/path/');

      expect(history.location.pathname).toBe('/path/');
    });

    it('should maintain state across navigation', () => {
      const state1 = { id: 1 };
      const state2 = { id: 2 };

      history.push('/page1', state1);
      expect(history.location.state).toEqual(state1);

      history.push('/page2', state2);
      expect(history.location.state).toEqual(state2);
    });

    it('should handle empty state', () => {
      history.push('/no-state');

      expect(history.location.state).toBeNull();
    });

    it('should maintain same instance throughout test', () => {
      const historyRef1 = history;
      const historyRef2 = history;

      expect(historyRef1).toBe(historyRef2);
    });

    it('should handle complex query strings', () => {
      history.push('/search?query=hello%20world&filters[]=active&filters[]=pending&sort=desc');

      expect(history.location.pathname).toBe('/search');
      expect(history.location.search).toContain('query=hello%20world');
      expect(history.location.search).toContain('filters[]=active');
      expect(history.location.search).toContain('filters[]=pending');
      expect(history.location.search).toContain('sort=desc');
    });

    it('should handle navigation to the same path', () => {
      history.push('/same-path');
      const firstKey = history.location.key;

      history.push('/same-path');
      const secondKey = history.location.key;

      expect(history.location.pathname).toBe('/same-path');
      expect(firstKey).not.toBe(secondKey); // Keys should be different
    });
  });
});
