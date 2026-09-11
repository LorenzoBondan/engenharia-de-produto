import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GuideDetails from './index';
import * as useGuideDetailsHook from '../../../../hooks/crud/useGuideDetails';

vi.mock('../../../../hooks/crud/useGuideDetails');
vi.mock('../../../../components/DialogInfo', () => ({
  default: () => <div>DialogInfo</div>,
}));
vi.mock('../../../../components/DialogConfirmation', () => ({
  default: () => <div>DialogConfirmation</div>,
}));
vi.mock('../../../../components/DropdownMenu', () => ({
  default: () => <div>DropdownMenu</div>,
}));

describe('GuideDetails', () => {
  const mockRoteiro = {
    codigo: 1,
    descricao: 'Roteiro Principal',
    implantacao: '2024-01-01' as any,
    dataFinal: '2024-12-31' as any,
    valor: 1500.0,
    situacao: 'ATIVO' as const,
    roteiroMaquinas: [
      {
        codigo: 100,
        maquina: {
          codigo: 10,
          nome: 'Serra CNC',
          grupoMaquina: { codigo: 1, nome: 'Grupo A', situacao: 'ATIVO' as const },
          formula: ['formula1'],
          valor: 100.0,
          situacao: 'ATIVO' as const,
        },
        roteiro: {} as any,
        tempoHomem: 30,
        tempoMaquina: 45,
        unidadeMedida: 'MIN',
        situacao: 'ATIVO' as const,
      },
      {
        codigo: 101,
        maquina: {
          codigo: 11,
          nome: 'Furadeira Múltipla',
          grupoMaquina: { codigo: 2, nome: 'Grupo B', situacao: 'ATIVO' as const },
          formula: ['formula2'],
          valor: 100.0,
          situacao: 'ATIVO' as const,
        },
        roteiro: {} as any,
        tempoHomem: 20,
        tempoMaquina: 30,
        unidadeMedida: 'MIN',
        situacao: 'ATIVO' as const,
      },
    ],
  };

  const mockUseGuideDetails = {
    roteiro: mockRoteiro,
    loading: false,
    error: null,
    refresh: vi.fn(),
    dialogInfoData: { visible: false, message: 'Sucesso!' },
    setDialogInfoData: vi.fn(),
    dialogConfirmationData: { visible: false, id: 0, message: 'Você tem certeza?' },
    setDialogConfirmationData: vi.fn(),
    handleDialogInfoClose: vi.fn(),
    handleUpdateClick: vi.fn(),
    handleDeleteClick: vi.fn(),
    handleDialogConfirmationAnswer: vi.fn(),
    handleInactivate: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGuideDetailsHook.useGuideDetails).mockReturnValue(mockUseGuideDetails);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render guide details with all information', () => {
    renderWithRouter(<GuideDetails />);

    expect(screen.getByText(/Roteiro Principal/)).toBeInTheDocument();
    expect(screen.getByText('1500')).toBeInTheDocument();
  });

  it('should display loading spinner when loading', () => {
    vi.mocked(useGuideDetailsHook.useGuideDetails).mockReturnValue({
      ...mockUseGuideDetails,
      roteiro: null,
      loading: true,
    });

    renderWithRouter(<GuideDetails />);

    expect(screen.getByLabelText('Carregando detalhes')).toBeInTheDocument();
  });

  it('should render machines table with roteiroMaquinas data', () => {
    renderWithRouter(<GuideDetails />);

    expect(screen.getByText('Máquinas')).toBeInTheDocument();
    expect(screen.getByText('Serra CNC')).toBeInTheDocument();
    expect(screen.getByText('Furadeira Múltipla')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('should display formatted dates', () => {
    renderWithRouter(<GuideDetails />);

    expect(screen.getAllByText(/01\/01\/2024/).length).toBeGreaterThan(0);
  });

  it('should not render entity when roteiro is null and not loading', () => {
    vi.mocked(useGuideDetailsHook.useGuideDetails).mockReturnValue({
      ...mockUseGuideDetails,
      roteiro: null,
      loading: false,
    });

    renderWithRouter(<GuideDetails />);

    expect(screen.queryByText('Máquinas')).not.toBeInTheDocument();
  });

  it('should render DialogInfo when visible', () => {
    vi.mocked(useGuideDetailsHook.useGuideDetails).mockReturnValue({
      ...mockUseGuideDetails,
      dialogInfoData: { visible: true, message: 'Teste!' },
    });

    renderWithRouter(<GuideDetails />);

    expect(screen.getByText('DialogInfo')).toBeInTheDocument();
  });

  it('should render DialogConfirmation when visible', () => {
    vi.mocked(useGuideDetailsHook.useGuideDetails).mockReturnValue({
      ...mockUseGuideDetails,
      dialogConfirmationData: { visible: true, id: 1, message: 'Confirmar?' },
    });

    renderWithRouter(<GuideDetails />);

    expect(screen.getByText('DialogConfirmation')).toBeInTheDocument();
  });
});
