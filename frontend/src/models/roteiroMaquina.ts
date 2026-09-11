import { DSituacaoEnum } from "./enums/situacao";
import { DMaquina } from "./maquina";
import { DRoteiro } from "./roteiro";

export type DRoteiroMaquina = {
    codigo: number;
    roteiro: DRoteiro;
    maquina: DMaquina;
    tempoMaquina: number;
    tempoHomem: number;
    unidadeMedida: string;
    situacao: keyof typeof DSituacaoEnum;
};