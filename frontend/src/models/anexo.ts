import { DBinario } from "./binario";

export type DAnexo = {
    codigo: number;
    binario: DBinario;
    nome: string;
    mimeType: string;
    url: string;
    checksum: string;
}