import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import MDPPage from './index';

vi.mock('../../../../../components/ItemCard', () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

describe('MDPPage', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render all 3 MDP items', () => {
    renderWithRouter(<MDPPage />);

    expect(screen.getByText('Chapas')).toBeInTheDocument();
    expect(screen.getByText('Fitas Borda')).toBeInTheDocument();
    expect(screen.getByText('Colas')).toBeInTheDocument();
  });

  it('should have correct navigation links', () => {
    renderWithRouter(<MDPPage />);

    const sheetsLink = screen.getByRole('link', { name: /Chapas/i });
    const edgeBandingsLink = screen.getByRole('link', { name: /Fitas Borda/i });
    const gluesLink = screen.getByRole('link', { name: /Colas/i });

    expect(sheetsLink).toHaveAttribute('href', '/sheets');
    expect(edgeBandingsLink).toHaveAttribute('href', '/edgebandings');
    expect(gluesLink).toHaveAttribute('href', '/glues');
  });
});
