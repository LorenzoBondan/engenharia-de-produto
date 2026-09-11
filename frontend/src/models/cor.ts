import { DSituacaoEnum } from "./enums/situacao";

export type DCor = {
    codigo: number;
    descricao: string;
    hexa: string;
    situacao: keyof typeof DSituacaoEnum;
};