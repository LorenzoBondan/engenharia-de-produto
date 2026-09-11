import { DSituacaoEnum } from "./enums/situacao";

export type DMedidas = {
    codigo: number;
    altura: number;
    largura: number;
    espessura: number;
    situacao: keyof typeof DSituacaoEnum;
};