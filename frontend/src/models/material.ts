import { DCor } from "./cor";
import { DSituacaoEnum } from "./enums/situacao";
import { DTipoMaterialEnum } from "./enums/tipoMaterial";

export type DMaterial = {
    codigo: number;
    descricao: string;
    tipoMaterial: keyof typeof DTipoMaterialEnum;
    implantacao: Date;
    porcentagemPerda: number;
    valor: number;
    cor?: DCor;
    situacao: keyof typeof DSituacaoEnum;
};