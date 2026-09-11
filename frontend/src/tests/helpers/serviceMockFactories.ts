import { DAcessorio } from '../../models/acessorio';
import { DAcessorioUsado } from '../../models/acessorioUsado';
import { DBaguete } from '../../models/baguete';
import { DCantoneira } from '../../models/cantoneira';
import { DCategoriaComponente } from '../../models/categoriaComponente';
import { DChapa } from '../../models/chapa';
import { DCola } from '../../models/cola';
import { DCor } from '../../models/cor';
import { DFilho } from '../../models/filho';
import { DFitaBorda } from '../../models/fitaBorda';
import { DPai } from '../../models/pai';
import { DGrupoMaquina } from '../../models/grupoMaquina';
import { DMaquina } from '../../models/maquina';
import { DMaterial } from '../../models/material';
import { DMedidas } from '../../models/medidas';
import { DModelo } from '../../models/modelo';
import { DPintura } from '../../models/pintura';
import { DPinturaBordaFundo } from '../../models/pinturaBordaFundo';
import { DPlastico } from '../../models/plastico';
import { DPoliester } from '../../models/poliester';
import { DPolietileno } from '../../models/polietileno';
import { DTnt } from '../../models/tnt';
import { DMaterialUsado } from '../../models/materialUsado';
import { DRoteiroMaquina } from '../../models/roteiroMaquina';
import { DRoteiro } from '../../models/roteiro';
import { DUser, DRole } from '../../models/user';
import { DUserAnexo } from '../../models/userAnexo';

/**
 * Create a mock DRole object
 */
export function createMockRole(overrides?: Partial<DRole>): DRole {
  return {
    id: 1,
    authority: 'ROLE_OPERATOR',
    ...overrides,
  };
}

/**
 * Create a mock DUser object
 */
export function createMockUser(overrides?: Partial<DUser>): DUser {
  return {
    id: 1,
    name: 'Test User',
    password: 'password123',
    email: 'test@example.com',
    userAnexo: {} as DUserAnexo, // Avoid circular reference
    situacao: 'ATIVO',
    roles: [createMockRole()],
    ...overrides,
  };
}

/**
 * Create a mock DCor object
 */
export function createMockCor(overrides?: Partial<DCor>): DCor {
  return {
    codigo: 1,
    descricao: 'Test Color',
    hexa: '#FFFFFF',
    situacao: 'ATIVO',
    ...overrides,
  };
}

/**
 * Create a mock DMedidas object
 */
export function createMockMedidas(overrides?: Partial<DMedidas>): DMedidas {
  return {
    codigo: 1,
    altura: 100,
    largura: 50,
    espessura: 30,
    situacao: 'ATIVO',
    ...overrides,
  };
}

/**
 * Create a mock DMaterial object (base for many materials)
 */
export function createMockMaterial(overrides?: Partial<DMaterial>): DMaterial {
  return {
    codigo: 1,
    descricao: 'Test Material',
    tipoMaterial: 'CHAPA_MDP',
    implantacao: new Date('2024-01-01'),
    porcentagemPerda: 5,
    valor: 100.5,
    cor: createMockCor(),
    situacao: 'ATIVO',
    ...overrides,
  };
}

/**
 * Create a mock DCategoriaComponente object
 */
export function createMockCategoriaComponente(overrides?: Partial<DCategoriaComponente>): DCategoriaComponente {
  return {
    codigo: 1,
    descricao: 'Test Category',
    situacao: 'ATIVO',
    ...overrides,
  };
}

/**
 * Create a mock DModelo object
 */
export function createMockModelo(overrides?: Partial<DModelo>): DModelo {
  return {
    codigo: 1,
    descricao: 'Test Model',
    situacao: 'ATIVO',
    ...overrides,
  };
}

/**
 * Create a mock DGrupoMaquina object
 */
export function createMockGrupoMaquina(overrides?: Partial<DGrupoMaquina>): DGrupoMaquina {
  return {
    codigo: 1,
    nome: 'Test Machine Group',
    situacao: 'ATIVO',
    ...overrides,
  };
}

/**
 * Create a mock DAcessorio object
 */
export function createMockAcessorio(overrides?: Partial<DAcessorio>): DAcessorio {
  return {
    codigo: 1,
    descricao: 'Test Accessory',
    medidas: createMockMedidas(),
    cor: createMockCor(),
    implantacao: new Date('2024-01-01'),
    valor: 50.0,
    situacao: 'ATIVO',
    ...overrides,
  };
}

export function createMockAcessorioUsado(overrides?: Partial<DAcessorioUsado>): DAcessorioUsado {
  return {
    codigo: 1,
    acessorio: createMockAcessorio(),
    filho: createMockFilho(),
    valor: 50.0,
    quantidade: 2,
    unidadeMedida: 'UNIDADE',
    situacao: 'ATIVO',
    ...overrides,
  };
}

export function createMockMaterialUsado(overrides?: Partial<DMaterialUsado>): DMaterialUsado {
  return {
    codigo: 1,
    material: createMockMaterial(),
    filho: createMockFilho(),
    valor: 50.0,
    quantidadeBruta: 2,
    quantidadeLiquida: 1.8,
    unidadeMedida: 'UNIDADE',
    situacao: 'ATIVO',
    ...overrides,
  };
}

export function createMockRoteiroMaquina(overrides?: Partial<DRoteiroMaquina>): DRoteiroMaquina {
  return {
    codigo: 1,
    roteiro: createMockRoteiro(),
    maquina: createMockMaquina(),
    tempoHomem: 50.0,
    tempoMaquina: 2,
    unidadeMedida: 'UNIDADE',
    situacao: 'ATIVO',
    ...overrides,
  };
}

export function createMockRoteiro(overrides?: Partial<DRoteiro>): DRoteiro {
  return {
    codigo: 1,
    descricao: 'Test Roteiro',
    dataFinal: new Date('2024-12-31'),
    implantacao: new Date('2024-01-01'),
    valor: 100.0,
    roteiroMaquinas: [],
    situacao: 'ATIVO',
    ...overrides,
  };
}

/**
 * Create a mock DBaguete object (extends DMaterial)
 */
export function createMockBaguete(overrides?: Partial<DBaguete>): DBaguete {
  return {
    ...createMockMaterial({ tipoMaterial: 'BAGUETE' }),
    ...overrides,
  };
}

/**
 * Create a mock DCantoneira object (extends DMaterial)
 */
export function createMockCantoneira(overrides?: Partial<DCantoneira>): DCantoneira {
  return {
    ...createMockMaterial({ tipoMaterial: 'CANTONEIRA' }),
    ...overrides,
  };
}

/**
 * Create a mock DChapa object (extends DMaterial with additional fields)
 */
export function createMockChapa(overrides?: Partial<DChapa>): DChapa {
  return {
    ...createMockMaterial({ tipoMaterial: 'CHAPA_MDP' }),
    espessura: 15,
    faces: 2,
    ...overrides,
  };
}

/**
 * Create a mock DCola object (extends DMaterial)
 */
export function createMockCola(overrides?: Partial<DCola>): DCola {
  return {
    gramatura: 500,
    ...createMockMaterial({ tipoMaterial: 'COLA' }),
    ...overrides,
  };
}

/**
 * Create a mock DFitaBorda object (extends DMaterial)
 */
export function createMockFitaBorda(overrides?: Partial<DFitaBorda>): DFitaBorda {
  return {
    altura: 20,
    espessura: 1,
    ...createMockMaterial({ tipoMaterial: 'FITA_BORDA' }),
    ...overrides,
  };
}

/**
 * Create a mock DPintura object (extends DMaterial)
 */
export function createMockPintura(overrides?: Partial<DPintura>): DPintura {
  return {
    tipoPintura: 'ACETINADA',
    ...createMockMaterial({ tipoMaterial: 'PINTURA' }),
    ...overrides,
  };
}

/**
 * Create a mock DPinturaBordaFundo object (extends DMaterial)
 */
export function createMockPinturaBordaFundo(overrides?: Partial<DPinturaBordaFundo>): DPinturaBordaFundo {
  return {
    ...createMockMaterial({ tipoMaterial: 'PINTURA' }),
    ...overrides,
  };
}

/**
 * Create a mock DPlastico object (extends DMaterial)
 */
export function createMockPlastico(overrides?: Partial<DPlastico>): DPlastico {
  return {
    gramatura: 300,
    ...createMockMaterial({ tipoMaterial: 'PLASTICO' }),
    ...overrides,
  };
}

/**
 * Create a mock DPoliester object (extends DMaterial)
 */
export function createMockPoliester(overrides?: Partial<DPoliester>): DPoliester {
  return {
    ...createMockMaterial({ tipoMaterial: 'POLIESTER' }),
    ...overrides,
  };
}

/**
 * Create a mock DPolietileno object (extends DMaterial)
 */
export function createMockPolietileno(overrides?: Partial<DPolietileno>): DPolietileno {
  return {
    ...createMockMaterial({ tipoMaterial: 'POLIETILENO' }),
    ...overrides,
  };
}

/**
 * Create a mock DTnt object (extends DMaterial)
 */
export function createMockTnt(overrides?: Partial<DTnt>): DTnt {
  return {
    ...createMockMaterial({ tipoMaterial: 'TNT' }),
    ...overrides,
  };
}

/**
 * Create a mock DMaquina object
 */
export function createMockMaquina(overrides?: Partial<DMaquina>): DMaquina {
  return {
    codigo: 1,
    nome: 'Test Machine',
    formula: ['x + y'],
    situacao: 'ATIVO',
    valor: 1000.0,
    grupoMaquina: createMockGrupoMaquina(),
    ...overrides,
  };
}
/**
 * Create a mock DPai object
 */
export function createMockPai(overrides?: Partial<DPai>): DPai {
  return {
    codigo: 1,
    descricao: 'Test Pai',
    modelo: createMockModelo(),
    categoriaComponente: createMockCategoriaComponente(),
    bordasComprimento: 0,
    bordasLargura: 0,
    numeroCantoneiras: 0,
    tntUmaFace: false,
    plasticoAcima: false,
    plasticoAdicional: 0,
    larguraPlastico: 0,
    faces: 2,
    especial: false,
    tipoPintura: 'ACETINADA',
    situacao: 'ATIVO',
    filhos: [],
    ...overrides,
  };
}

export function createMockFilho(overrides?: Partial<DFilho>): DFilho {
  return {
    codigo: 1,
    descricao: 'Test Filho',
    pai: createMockPai(),
    cor: createMockCor(),
    medidas: createMockMedidas(),
    roteiro: {} as any, // Add required roteiro property with empty object or create a proper mock
    unidadeMedida: 'UNIDADE',
    implantacao: new Date('2024-01-01'),
    valor: 100.0,
    tipo: 'MDP',
    situacao: 'ATIVO',
    filhos: [],
    acessoriosUsados: [],
    materiaisUsados: [],
    ...overrides,
  };
}
