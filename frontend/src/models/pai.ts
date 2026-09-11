import { DCategoriaComponente } from "./categoriaComponente";
import { DSituacaoEnum } from "./enums/situacao";
import { DTipoPinturaEnum } from "./enums/tipoPintura";
import { DFilho } from "./filho";
import { DModelo } from "./modelo";

export type DPai = {
    codigo: number;
    modelo: DModelo;
    categoriaComponente: DCategoriaComponente;
    descricao: string;
    bordasComprimento: number;
    bordasLargura: number;
    numeroCantoneiras: number;
    tntUmaFace: boolean;
    plasticoAcima: boolean;
    plasticoAdicional: number;
    larguraPlastico: number;
    faces: number;
    especial: boolean;
    tipoPintura: keyof typeof DTipoPinturaEnum;
    situacao: keyof typeof DSituacaoEnum;
    filhos: DFilho[];
};