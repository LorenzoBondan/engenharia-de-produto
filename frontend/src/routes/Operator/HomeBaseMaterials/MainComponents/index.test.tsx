import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import MainComponents from './index';

vi.mock('../../../../components/ModuleCard', () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

describe('MainComponents', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render all 6 module cards', () => {
    renderWithRouter(<MainComponents />);

    expect(screen.getByText('MDP')).toBeInTheDocument();
    expect(screen.getByText('MDF')).toBeInTheDocument();
    expect(screen.getByText('Alumínios')).toBeInTheDocument();
    expect(screen.getByText('Embalagem')).toBeInTheDocument();
    expect(screen.getByText('Máquinas')).toBeInTheDocument();
    expect(screen.getByText('Cores, Modelos, Categorias e Medidas')).toBeInTheDocument();
  });

  it('should have correct navigation links', () => {
    renderWithRouter(<MainComponents />);

    const mdpLink = screen.getByRole('link', { name: /MDP/i });
    const mdfLink = screen.getByRole('link', { name: /MDF/i });
    const aluminiumLink = screen.getByRole('link', { name: /Alumínios/i });
    const packagingLink = screen.getByRole('link', { name: /Embalagem/i });
    const machinesLink = screen.getByRole('link', { name: /Máquinas/i });
    const colorsLink = screen.getByRole('link', { name: /Cores/i });

    expect(mdpLink).toHaveAttribute('href', '/homebasematerials/mdp');
    expect(mdfLink).toHaveAttribute('href', '/homebasematerials/mdf');
    expect(aluminiumLink).toHaveAttribute('href', '/homebasematerials/aluminium');
    expect(packagingLink).toHaveAttribute('href', '/homebasematerials/packaging');
    expect(machinesLink).toHaveAttribute('href', '/homebasematerials/machines');
    expect(colorsLink).toHaveAttribute('href', '/homebasematerials/public');
  });
});
