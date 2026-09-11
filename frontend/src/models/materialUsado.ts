import { DSituacaoEnum } from "./enums/situacao";
import { DFilho } from "./filho";
import { DMaterial } from "./material";

export type DMaterialUsado = {
    codigo: number;
    material: DMaterial;
    filho: DFilho;
    quantidadeLiquida: number;
    quantidadeBruta: number;
    valor: number;
    unidadeMedida: string;
    situacao: keyof typeof DSituacaoEnum;
};