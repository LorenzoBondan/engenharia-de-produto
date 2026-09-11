import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import AluminiumPage from './index';

vi.mock('../../../../../components/ItemCard', () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

describe('AluminiumPage', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render all 2 Aluminium items', () => {
    renderWithRouter(<AluminiumPage />);

    expect(screen.getByText('Acessórios')).toBeInTheDocument();
    expect(screen.getByText('Baguetes')).toBeInTheDocument();
  });

  it('should have correct navigation links', () => {
    renderWithRouter(<AluminiumPage />);

    const accessoriesLink = screen.getByRole('link', { name: /Acessórios/i });
    const moldingsLink = screen.getByRole('link', { name: /Baguetes/i });

    expect(accessoriesLink).toHaveAttribute('href', '/accessories');
    expect(moldingsLink).toHaveAttribute('href', '/moldings');
  });
});
