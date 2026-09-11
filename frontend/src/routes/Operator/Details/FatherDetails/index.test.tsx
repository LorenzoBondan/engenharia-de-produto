import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FatherDetails from './index';
import * as useFatherDetailsHook from '../../../../hooks/crud/useFatherDetails';

vi.mock('../../../../hooks/crud/useFatherDetails');
vi.mock('../../../../components/DialogInfo', () => ({
  default: () => <div>DialogInfo</div>,
}));
vi.mock('../../../../components/DialogConfirmation', () => ({
  default: () => <div>DialogConfirmation</div>,
}));
vi.mock('../../../../components/DropdownMenu', () => ({
  default: () => <div>DropdownMenu</div>,
}));

describe('FatherDetails', () => {
  const mockPai = {
    codigo: 1,
    descricao: 'Porta Principal',
    modelo: { codigo: 1, descricao: 'Modelo A', situacao: 'ATIVO' as const },
    categoriaComponente: { codigo: 1, descricao: 'Categoria X', situacao: 'ATIVO' as const },
    bordasComprimento: 2,
    bordasLargura: 2,
    numeroCantoneiras: 4,
    tntUmaFace: true,
    plasticoAcima: false,
    plasticoAdicional: 0,
    larguraPlastico: 0,
    faces: 1,
    especial: false,
    tipoPintura: 'ACETINADA' as const,
    situacao: 'ATIVO' as const,
    filhos: [
      {
        codigo: 10,
        descricao: 'Porta Frontal',
        pai: {} as any,
        cor: { codigo: 1, descricao: 'Branco', hexa: '#FFFFFF', situacao: 'ATIVO' as const },
        medidas: { codigo: 1, altura: 2100, largura: 600, espessura: 18, situacao: 'ATIVO' as const },
        roteiro: { codigo: 1, descricao: 'Roteiro A', implantacao: '2024-01-01' as any, dataFinal: '2024-12-31' as any, valor: 100, situacao: 'ATIVO' as const, roteiroMaquinas: [] },
        unidadeMedida: 'UN',
        implantacao: '2024-01-01' as any,
        valor: 150.0,
        tipo: 'MDP' as const,
        situacao: 'ATIVO' as const,
        filhos: [],
        materiaisUsados: [],
        acessoriosUsados: [],
      },
      {
        codigo: 11,
        descricao: 'Gaveta Superior',
        pai: {} as any,
        cor: { codigo: 2, descricao: 'Preto', hexa: '#000000', situacao: 'ATIVO' as const },
        medidas: { codigo: 2, altura: 350, largura: 450, espessura: 18, situacao: 'ATIVO' as const },
        roteiro: { codigo: 2, descricao: 'Roteiro B', implantacao: '2024-02-01' as any, dataFinal: '2024-12-31' as any, valor: 80, situacao: 'ATIVO' as const, roteiroMaquinas: [] },
        unidadeMedida: 'UN',
        implantacao: '2024-02-01' as any,
        valor: 100.0,
        tipo: 'MDF' as const,
        situacao: 'ATIVO' as const,
        filhos: [],
        materiaisUsados: [],
        acessoriosUsados: [],
      },
    ],
  };

  const mockUseFatherDetails = {
    pai: mockPai,
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
    vi.mocked(useFatherDetailsHook.useFatherDetails).mockReturnValue(mockUseFatherDetails);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render father details with all information', () => {
    renderWithRouter(<FatherDetails />);

    expect(screen.getByText(/Porta Principal/)).toBeInTheDocument();
    expect(screen.getByText('Modelo A')).toBeInTheDocument();
    expect(screen.getByText('Categoria X')).toBeInTheDocument();
    expect(screen.getAllByText('2').length).toBeGreaterThan(0);
  });

  it('should display loading spinner when loading', () => {
    vi.mocked(useFatherDetailsHook.useFatherDetails).mockReturnValue({
      ...mockUseFatherDetails,
      pai: null,
      loading: true,
    });

    renderWithRouter(<FatherDetails />);

    expect(screen.getByLabelText('Carregando detalhes')).toBeInTheDocument();
  });

  it('should render filhos table with children data', () => {
    renderWithRouter(<FatherDetails />);

    expect(screen.getByText('Filhos')).toBeInTheDocument();
    expect(screen.getByText('Porta Frontal')).toBeInTheDocument();
    expect(screen.getByText('Gaveta Superior')).toBeInTheDocument();
    expect(screen.getByText('Branco')).toBeInTheDocument();
    expect(screen.getByText('Preto')).toBeInTheDocument();
  });

  it('should not render entity when pai is null and not loading', () => {
    vi.mocked(useFatherDetailsHook.useFatherDetails).mockReturnValue({
      ...mockUseFatherDetails,
      pai: null,
      loading: false,
    });

    renderWithRouter(<FatherDetails />);

    expect(screen.queryByText('Filhos')).not.toBeInTheDocument();
  });

  it('should render DialogInfo when visible', () => {
    vi.mocked(useFatherDetailsHook.useFatherDetails).mockReturnValue({
      ...mockUseFatherDetails,
      dialogInfoData: { visible: true, message: 'Teste!' },
    });

    renderWithRouter(<FatherDetails />);

    expect(screen.getByText('DialogInfo')).toBeInTheDocument();
  });

  it('should render DialogConfirmation when visible', () => {
    vi.mocked(useFatherDetailsHook.useFatherDetails).mockReturnValue({
      ...mockUseFatherDetails,
      dialogConfirmationData: { visible: true, id: 1, message: 'Confirmar?' },
    });

    renderWithRouter(<FatherDetails />);

    expect(screen.getByText('DialogConfirmation')).toBeInTheDocument();
  });
});
