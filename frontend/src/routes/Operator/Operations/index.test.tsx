import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Operations from './index';

describe('Operations', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render all 3 operation sections', () => {
    renderWithRouter(<Operations />);

    expect(screen.getByText(/Gere automaticamente cadastros/)).toBeInTheDocument();
    expect(screen.getByText(/Crie e altere manualmente itens/)).toBeInTheDocument();
    expect(screen.getByText(/Busque e altere os materiais base/)).toBeInTheDocument();
  });

  it('should have 3 Acessar buttons', () => {
    renderWithRouter(<Operations />);

    const acessarButtons = screen.getAllByRole('link', { name: /Acessar/i });
    expect(acessarButtons).toHaveLength(3);
  });

  it('should have correct navigation links for each section', () => {
    renderWithRouter(<Operations />);

    const links = screen.getAllByRole('link');

    const homeStructsLink = links.find(link => link.getAttribute('href') === '/homestructs');
    const homeItemsLink = links.find(link => link.getAttribute('href') === '/homeitems');
    const homeBaseMaterialsLink = links.find(link => link.getAttribute('href') === '/homebasematerials');

    expect(homeStructsLink).toBeDefined();
    expect(homeItemsLink).toBeDefined();
    expect(homeBaseMaterialsLink).toBeDefined();
  });
});
