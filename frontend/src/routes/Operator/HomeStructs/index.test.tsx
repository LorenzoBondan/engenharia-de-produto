import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import HomeStruct from './index';

vi.mock('../../../components/ModuleCard', () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

describe('HomeStruct', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render title and all 2 structure cards', () => {
    renderWithRouter(<HomeStruct />);

    expect(screen.getByText('Estruturas')).toBeInTheDocument();
    expect(screen.getByText('Estrutura MDP/MDF')).toBeInTheDocument();
    expect(screen.getByText('Estrutura Modulação/Alumínios')).toBeInTheDocument();
  });

  it('should have correct navigation links', () => {
    renderWithRouter(<HomeStruct />);

    const singleStructLink = screen.getByRole('link', { name: /Estrutura MDP\/MDF/i });
    const multiStructLink = screen.getByRole('link', { name: /Estrutura Modulação\/Alumínios/i });

    expect(singleStructLink).toHaveAttribute('href', '/singlestruct');
    expect(multiStructLink).toHaveAttribute('href', '/multistruct');
  });
});
