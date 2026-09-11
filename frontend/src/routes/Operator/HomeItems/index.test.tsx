import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomeItems from './index';

describe('HomeItems', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render link to sons page', () => {
    renderWithRouter(<HomeItems />);

    const link = screen.getByRole('link', { name: /filhos/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/sons');
  });

  it('should render link to guides page', () => {
    renderWithRouter(<HomeItems />);

    const link = screen.getByRole('link', { name: /roteiros/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/guides');
  });

  it('should render all navigation items', () => {
    renderWithRouter(<HomeItems />);

    expect(screen.getByText('Pais')).toBeInTheDocument();
    expect(screen.getByText('Filhos')).toBeInTheDocument();
    expect(screen.getByText('Roteiros')).toBeInTheDocument();
  });
});
