import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import MDFPage from './index';

vi.mock('../../../../../components/ItemCard', () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

describe('MDFPage', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render all 3 MDF items', () => {
    renderWithRouter(<MDFPage />);

    expect(screen.getByText('Pinturas')).toBeInTheDocument();
    expect(screen.getByText('Pinturas de Borda de Fundo')).toBeInTheDocument();
    expect(screen.getByText('Poliésters')).toBeInTheDocument();
  });

  it('should have correct navigation links', () => {
    renderWithRouter(<MDFPage />);

    const links = screen.getAllByRole('link');

    const paintingsLink = links.find(link => link.getAttribute('href') === '/paintings');
    const paintingBordersLink = links.find(link => link.getAttribute('href') === '/paintingBorderBackgrounds');
    const polyestersLink = links.find(link => link.getAttribute('href') === '/polyesters');

    expect(paintingsLink).toBeDefined();
    expect(paintingBordersLink).toBeDefined();
    expect(polyestersLink).toBeDefined();
  });
});
