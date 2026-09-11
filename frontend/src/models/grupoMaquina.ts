import { DSituacaoEnum } from "./enums/situacao";

export type DGrupoMaquina = {
    codigo: number;
    nome: string;
    situacao: keyof typeof DSituacaoEnum;
};