import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SonDetails from './index';
import * as useSonDetailsHook from '../../../../hooks/crud/useSonDetails';

vi.mock('../../../../hooks/crud/useSonDetails');
vi.mock('../../../../components/DialogInfo', () => ({
  default: () => <div>DialogInfo</div>,
}));
vi.mock('../../../../components/DialogConfirmation', () => ({
  default: () => <div>DialogConfirmation</div>,
}));
vi.mock('../../../../components/DropdownMenu', () => ({
  default: () => <div>DropdownMenu</div>,
}));

describe('SonDetails', () => {
  const mockFilho = {
    codigo: 1,
    descricao: 'Porta Frontal',
    pai: {
      codigo: 100,
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
      filhos: [],
    },
    cor: { codigo: 1, descricao: 'Branco', hexa: '#FFFFFF', situacao: 'ATIVO' as const },
    medidas: { codigo: 1, altura: 2100, largura: 600, espessura: 18, situacao: 'ATIVO' as const },
    roteiro: {
      codigo: 1,
      descricao: 'Roteiro A',
      implantacao: '2024-01-01' as any,
      dataFinal: '2024-12-31' as any,
      valor: 100,
      situacao: 'ATIVO' as const,
      roteiroMaquinas: [],
    },
    unidadeMedida: 'UN',
    implantacao: '2024-01-01' as any,
    valor: 150.0,
    tipo: 'MDP' as const,
    situacao: 'ATIVO' as const,
    filhos: [
      {
        codigo: 10,
        descricao: 'Gaveta Interna',
        pai: {} as any,
        cor: { codigo: 2, descricao: 'Preto', hexa: '#000000', situacao: 'ATIVO' as const },
        medidas: { codigo: 2, altura: 350, largura: 450, espessura: 18, situacao: 'ATIVO' as const },
        roteiro: {} as any,
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
    materiaisUsados: [
      {
        codigo: 200,
        material: {
          codigo: 20,
          descricao: 'Chapa MDP Branca',
          tipoMaterial: 'CHAPA_MDP' as const,
          implantacao: '2024-01-01' as any,
          porcentagemPerda: 5.0,
          valor: 120.0,
          cor: { codigo: 1, descricao: 'Branco', hexa: '#FFFFFF', situacao: 'ATIVO' as const },
          situacao: 'ATIVO' as const,
        },
        filho: {} as any,
        quantidadeLiquida: 2.5,
        quantidadeBruta: 3.0,
        unidadeMedida: 'M2',
        valor: 300.0,
        situacao: 'ATIVO' as const,
      },
      {
        codigo: 201,
        material: {
          codigo: 21,
          descricao: 'Fita Borda Preta',
          tipoMaterial: 'FITA_BORDA' as const,
          implantacao: '2024-02-01' as any,
          porcentagemPerda: 2.0,
          valor: 15.0,
          cor: { codigo: 2, descricao: 'Preto', hexa: '#000000', situacao: 'ATIVO' as const },
          situacao: 'ATIVO' as const,
        },
        filho: {} as any,
        quantidadeLiquida: 5.0,
        quantidadeBruta: 5.5,
        unidadeMedida: 'M',
        valor: 82.5,
        situacao: 'ATIVO' as const,
      },
    ],
    acessoriosUsados: [
      {
        codigo: 300,
        acessorio: {
          codigo: 30,
          descricao: 'Dobradiça',
          medidas: { codigo: 1, altura: 100, largura: 50, espessura: 3, situacao: 'ATIVO' as const },
          cor: { codigo: 1, descricao: 'Preto', hexa: '#000000', situacao: 'ATIVO' as const },
          implantacao: '2024-01-01' as any,
          valor: 5.0,
          situacao: 'ATIVO' as const,
        },
        filho: {} as any,
        quantidade: 4,
        unidadeMedida: 'UN',
        valor: 20.0,
        situacao: 'ATIVO' as const,
      },
      {
        codigo: 301,
        acessorio: {
          codigo: 31,
          descricao: 'Puxador',
          medidas: { codigo: 2, altura: 120, largura: 30, espessura: 2, situacao: 'ATIVO' as const },
          cor: { codigo: 2, descricao: 'Cromado', hexa: '#C0C0C0', situacao: 'ATIVO' as const },
          implantacao: '2024-02-01' as any,
          valor: 8.0,
          situacao: 'ATIVO' as const,
        },
        filho: {} as any,
        quantidade: 2,
        unidadeMedida: 'UN',
        valor: 16.0,
        situacao: 'ATIVO' as const,
      },
    ],
  };

  const mockUseSonDetails = {
    filho: mockFilho,
    loading: false,
    error: null,
    refresh: vi.fn(),
    dialogInfoData: { visible: false, message: 'Sucesso!' },
    setDialogInfoData: vi.fn(),
    dialogConfirmationData: { visible: false, id: 0, message: 'Você tem certeza?', type: '' },
    setDialogConfirmationData: vi.fn(),
    handleDialogInfoClose: vi.fn(),
    handleAccessoryInactivate: vi.fn(),
    handleMaterialInactivate: vi.fn(),
    handleSonInactivate: vi.fn(),
    handleAccessoryDeleteClick: vi.fn(),
    handleMaterialDeleteClick: vi.fn(),
    handleSonDeleteClick: vi.fn(),
    handleDialogConfirmationAnswer: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSonDetailsHook.useSonDetails).mockReturnValue(mockUseSonDetails);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render son details with all information', () => {
    renderWithRouter(<SonDetails />);

    expect(screen.getByText(/Porta Frontal/)).toBeInTheDocument();
    expect(screen.getByText('Porta Principal')).toBeInTheDocument();
    expect(screen.getByText('Branco')).toBeInTheDocument();
    expect(screen.getByText(/2100/)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 150/)).toBeInTheDocument();
  });

  it('should display loading spinner when loading', () => {
    vi.mocked(useSonDetailsHook.useSonDetails).mockReturnValue({
      ...mockUseSonDetails,
      filho: null,
      loading: true,
    });

    renderWithRouter(<SonDetails />);

    expect(screen.getByLabelText('Carregando detalhes')).toBeInTheDocument();
  });

  it('should render materiais table with materiaisUsados data', () => {
    renderWithRouter(<SonDetails />);

    expect(screen.getByText('Materiais')).toBeInTheDocument();
    expect(screen.getByText('Chapa MDP Branca')).toBeInTheDocument();
    expect(screen.getByText('Fita Borda Preta')).toBeInTheDocument();
    expect(screen.getByText('2.5 M2')).toBeInTheDocument();
    expect(screen.getByText('5 M')).toBeInTheDocument();
  });

  it('should render acessorios table with acessoriosUsados data', () => {
    renderWithRouter(<SonDetails />);

    expect(screen.getByText('Acessórios')).toBeInTheDocument();
    expect(screen.getByText('Dobradiça')).toBeInTheDocument();
    expect(screen.getByText('Puxador')).toBeInTheDocument();
    expect(screen.getByText('4 UN')).toBeInTheDocument();
    expect(screen.getByText('2 UN')).toBeInTheDocument();
  });

  it('should render filhos table with nested sons data', () => {
    renderWithRouter(<SonDetails />);

    expect(screen.getByText('Filhos')).toBeInTheDocument();
    expect(screen.getByText('Gaveta Interna')).toBeInTheDocument();
    expect(screen.getByText('Preto')).toBeInTheDocument();
  });

  it('should not render entity when filho is null and not loading', () => {
    vi.mocked(useSonDetailsHook.useSonDetails).mockReturnValue({
      ...mockUseSonDetails,
      filho: null,
      loading: false,
    });

    renderWithRouter(<SonDetails />);

    expect(screen.queryByText('Materiais')).not.toBeInTheDocument();
    expect(screen.queryByText('Acessórios')).not.toBeInTheDocument();
  });

  it('should render DialogInfo when visible', () => {
    vi.mocked(useSonDetailsHook.useSonDetails).mockReturnValue({
      ...mockUseSonDetails,
      dialogInfoData: { visible: true, message: 'Teste!' },
    });

    renderWithRouter(<SonDetails />);

    expect(screen.getByText('DialogInfo')).toBeInTheDocument();
  });

  it('should render DialogConfirmation when visible', () => {
    vi.mocked(useSonDetailsHook.useSonDetails).mockReturnValue({
      ...mockUseSonDetails,
      dialogConfirmationData: { visible: true, id: 1, message: 'Confirmar?', type: 'accessory' },
    });

    renderWithRouter(<SonDetails />);

    expect(screen.getByText('DialogConfirmation')).toBeInTheDocument();
  });
});
