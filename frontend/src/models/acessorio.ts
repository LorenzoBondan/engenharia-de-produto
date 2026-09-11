import { DCor } from "./cor";
import { DSituacaoEnum } from "./enums/situacao";
import { DMedidas } from "./medidas";

export type DAcessorio = {
    codigo: number;
    descricao: string;
    medidas: DMedidas;
    cor: DCor;
    implantacao: Date;
    valor: number;
    situacao: keyof typeof DSituacaoEnum;
};