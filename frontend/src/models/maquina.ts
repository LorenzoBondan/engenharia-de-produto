import { DSituacaoEnum } from "./enums/situacao";
import { DGrupoMaquina } from "./grupoMaquina";

export type DMaquina = {
    codigo: number;
    nome: string;
    formula: string[];
    valor: number;
    grupoMaquina: DGrupoMaquina;
    situacao: keyof typeof DSituacaoEnum;
};