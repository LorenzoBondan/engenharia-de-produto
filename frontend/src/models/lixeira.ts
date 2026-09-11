import { DSituacaoEnum } from "./enums/situacao";

export type DLixeira = {
    id: number;
    nometabela: string;
    data: Date;
    entidadeid: Record<string, any>;
    usuario: string;
    situacao: keyof typeof DSituacaoEnum;
    tabela: string;
}