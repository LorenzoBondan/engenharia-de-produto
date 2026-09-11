import { DAcessorio } from "./acessorio";
import { DSituacaoEnum } from "./enums/situacao";
import { DFilho } from "./filho";

export type DAcessorioUsado = {
    codigo: number;
    acessorio: DAcessorio;
    filho: DFilho;
    quantidade: number;
    valor: number;
    unidadeMedida: string;
    situacao: keyof typeof DSituacaoEnum;
};