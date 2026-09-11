import { DAcessorioQuantidade } from "./acessorioQuantidade";
import { DCor } from "./cor";
import { DItemModulacao } from "./itemModulacao";
import { DMaterial } from "./material";
import { DMedidas } from "./medidas";
import { DPai } from "./pai";

export type DMontadorEstruturaPaiModulacao = {
    paiPrincipal: DPai;
    medidasPaiPrincipal: DMedidas;
    paisSecundarios: DItemModulacao[];
    cores: DCor[];
    materiais: DMaterial[];
    implantacao: Date;
    acessoriosQuantidades: DAcessorioQuantidade[];
};