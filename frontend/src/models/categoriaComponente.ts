import { DSituacaoEnum } from "./enums/situacao";

export type DCategoriaComponente = {
    codigo: number;
    descricao: string;
    situacao: keyof typeof DSituacaoEnum;
};