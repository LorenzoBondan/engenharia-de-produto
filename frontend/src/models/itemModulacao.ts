import { DMaquina } from "./maquina";
import { DMedidas } from "./medidas";
import { DPai } from "./pai";

export type DItemModulacao = {
    pai: DPai;
    medidas: DMedidas;
    maquinas: DMaquina[];
};