import { DSituacaoEnum } from "./enums/situacao";
import { DRoteiroMaquina } from "./roteiroMaquina";

export type DRoteiro = {
    codigo: number;
    descricao: string;
    implantacao: Date;
    dataFinal: Date;
    valor: number;
    situacao: keyof typeof DSituacaoEnum;

    roteiroMaquinas: DRoteiroMaquina[];
};