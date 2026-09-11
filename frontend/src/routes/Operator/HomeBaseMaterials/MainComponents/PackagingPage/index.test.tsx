import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import PackagingPage from './index';

vi.mock('../../../../../components/ItemCard', () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

describe('PackagingPage', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render all 4 Packaging items', () => {
    renderWithRouter(<PackagingPage />);

    expect(screen.getByText('Cantoneiras')).toBeInTheDocument();
    expect(screen.getByText('TNTs')).toBeInTheDocument();
    expect(screen.getByText('Plásticos')).toBeInTheDocument();
    expect(screen.getByText('Polietilenos')).toBeInTheDocument();
  });

  it('should have correct navigation links', () => {
    renderWithRouter(<PackagingPage />);

    const cornerBracketsLink = screen.getByRole('link', { name: /Cantoneiras/i });
    const nonwovenFabricsLink = screen.getByRole('link', { name: /TNTs/i });
    const plasticsLink = screen.getByRole('link', { name: /Plásticos/i });
    const polyethylenesLink = screen.getByRole('link', { name: /Polietilenos/i });

    expect(cornerBracketsLink).toHaveAttribute('href', '/cornerBrackets');
    expect(nonwovenFabricsLink).toHaveAttribute('href', '/nonwovenFabrics');
    expect(plasticsLink).toHaveAttribute('href', '/plastics');
    expect(polyethylenesLink).toHaveAttribute('href', '/polyethylenes');
  });
});
