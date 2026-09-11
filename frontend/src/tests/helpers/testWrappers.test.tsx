import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderWithRouter, renderWithProviders } from './testWrappers';
import { useNavigate, useParams } from 'react-router-dom';

// Test components
function TestComponent() {
  return <div>Test Component</div>;
}

function RouterTestComponent() {
  const navigate = useNavigate();
  const params = useParams();

  return (
    <div>
      <div>Router Test Component</div>
      <button onClick={() => navigate('/test')}>Navigate</button>
      <div data-testid="params">{JSON.stringify(params)}</div>
    </div>
  );
}

describe('Test Wrapper Utilities', () => {
  describe('renderWithRouter', () => {
    it('should render component with router context', () => {
      renderWithRouter(<TestComponent />);

      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });

    it('should provide router hooks to component', () => {
      renderWithRouter(<RouterTestComponent />);

      expect(screen.getByText('Router Test Component')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Navigate' })).toBeInTheDocument();
    });

    it('should render with initial route', () => {
      renderWithRouter(<RouterTestComponent />, { initialRoute: '/test/123' });

      expect(screen.getByText('Router Test Component')).toBeInTheDocument();
    });

    it('should allow custom router options', () => {
      const { container } = renderWithRouter(<TestComponent />, {
        initialRoute: '/custom',
      });

      expect(container).toBeInTheDocument();
    });
  });

  describe('renderWithProviders', () => {
    it('should render component with all providers', () => {
      renderWithProviders(<TestComponent />);

      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });

    it('should provide router context', () => {
      renderWithProviders(<RouterTestComponent />);

      expect(screen.getByText('Router Test Component')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Navigate' })).toBeInTheDocument();
    });

    it('should accept initial route option', () => {
      renderWithProviders(<RouterTestComponent />, {
        initialRoute: '/test',
      });

      expect(screen.getByText('Router Test Component')).toBeInTheDocument();
    });
  });
});
