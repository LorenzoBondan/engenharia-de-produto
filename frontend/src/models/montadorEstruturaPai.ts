import { DCategoriaComponente } from "./categoriaComponente";
import { DCor } from "./cor";
import { DTipoFilhoEnum } from "./enums/tipoFilho";
import { DTipoPinturaEnum } from "./enums/tipoPintura";
import { DMaquina } from "./maquina";
import { DMaterial } from "./material";
import { DMedidas } from "./medidas";
import { DModelo } from "./modelo";

export type DMontadorEstruturaPai = {
    modelo: DModelo;
    categoriaComponente: DCategoriaComponente;
    cores: DCor[];
    medidas: DMedidas[];
    materiais: DMaterial[];
    maquinas: DMaquina[];
    implantacao: Date;
    tipoFilho: keyof typeof DTipoFilhoEnum;
    bordasComprimento: number;
    bordasLargura: number;
    plasticoAcima: boolean;
    plasticoAdicional: number;
    larguraPlastico: number;
    numeroCantoneiras: number;
    tntUmaFace: boolean;
    tipoPintura: keyof typeof DTipoPinturaEnum;
    faces: number;
    especial: boolean;
};