import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import PublicPage from './index';

vi.mock('../../../../../components/ItemCard', () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

describe('PublicPage', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render all 4 Public items', () => {
    renderWithRouter(<PublicPage />);

    expect(screen.getByText('Cores')).toBeInTheDocument();
    expect(screen.getByText('Modelos')).toBeInTheDocument();
    expect(screen.getByText('Categorias de Componentes')).toBeInTheDocument();
    expect(screen.getByText('Medidas')).toBeInTheDocument();
  });

  it('should have correct navigation links', () => {
    renderWithRouter(<PublicPage />);

    const colorsLink = screen.getByRole('link', { name: /Cores/i });
    const modelsLink = screen.getByRole('link', { name: /Modelos/i });
    const categoriesLink = screen.getByRole('link', { name: /Categorias de Componentes/i });
    const measuresLink = screen.getByRole('link', { name: /Medidas/i });

    expect(colorsLink).toHaveAttribute('href', '/colors');
    expect(modelsLink).toHaveAttribute('href', '/models');
    expect(categoriesLink).toHaveAttribute('href', '/componentcategories');
    expect(measuresLink).toHaveAttribute('href', '/measures');
  });
});
