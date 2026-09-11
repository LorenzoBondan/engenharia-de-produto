import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminHome from './index';

describe('AdminHome', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render the admin home page', () => {
    renderWithRouter(<AdminHome />);

    expect(screen.getByRole('heading', { name: /painel administrativo/i })).toBeInTheDocument();
  });

  it('should render link to users page', () => {
    renderWithRouter(<AdminHome />);

    const link = screen.getByRole('link', { name: /usuários/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/admin/users');
  });
});
