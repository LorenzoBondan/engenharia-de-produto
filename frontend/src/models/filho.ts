import { DAcessorioUsado } from "./acessorioUsado";
import { DCor } from "./cor";
import { DSituacaoEnum } from "./enums/situacao";
import { DTipoFilhoEnum } from "./enums/tipoFilho";
import { DMaterialUsado } from "./materialUsado";
import { DMedidas } from "./medidas";
import { DPai } from "./pai";
import { DRoteiro } from "./roteiro";

export type DFilho = {
    codigo: number;
    descricao: string;
    pai: DPai;
    cor: DCor;
    medidas: DMedidas;
    roteiro: DRoteiro;
    unidadeMedida: string;
    implantacao: Date;
    valor: number;
    tipo: keyof typeof DTipoFilhoEnum;
    situacao: keyof typeof DSituacaoEnum;
    filhos: DFilho[];
    materiaisUsados: DMaterialUsado[];
    acessoriosUsados: DAcessorioUsado[];
};