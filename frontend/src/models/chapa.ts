import { DMaterial } from "./material";

export type DChapa = DMaterial & {
    espessura: number;
    faces: number;
};