import { DTipoPinturaEnum } from "./enums/tipoPintura";
import { DMaterial } from "./material";

export type DPintura = DMaterial & {
    tipoPintura: keyof typeof DTipoPinturaEnum;
};