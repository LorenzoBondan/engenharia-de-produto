import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import MachinePage from './index';

vi.mock('../../../../../components/ItemCard', () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

describe('MachinePage', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render all 2 Machine items', () => {
    renderWithRouter(<MachinePage />);

    const maquinasElements = screen.getAllByText('Máquinas');
    expect(maquinasElements).toHaveLength(2);
    expect(screen.getByText('Grupos de Máquinas')).toBeInTheDocument();
  });

  it('should have correct navigation links', () => {
    renderWithRouter(<MachinePage />);

    const links = screen.getAllByRole('link');

    const machinesLink = links.find(link => link.getAttribute('href') === '/machines');
    const machineGroupsLink = links.find(link => link.getAttribute('href') === '/machineGroups');

    expect(machinesLink).toBeDefined();
    expect(machineGroupsLink).toBeDefined();
  });
});
