import { DSituacaoEnum } from "./enums/situacao";

export type DModelo = {
    codigo: number;
    descricao: string;
    situacao: keyof typeof DSituacaoEnum;
};