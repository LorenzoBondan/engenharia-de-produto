import { DAnexo } from "./anexo";
import { DUser } from "./user";

export type DUserAnexo = {
    codigo: number;
    user: DUser;
    anexo: DAnexo;
}