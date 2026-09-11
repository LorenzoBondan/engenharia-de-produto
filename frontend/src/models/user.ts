import { DSituacaoEnum } from "./enums/situacao";
import { DUserAnexo } from "./userAnexo";

export type DUser = {
    id: number;
    name: string;
    password: string;
    email: string;
    userAnexo?: DUserAnexo;

    situacao: keyof typeof DSituacaoEnum;

    roles: DRole[];
};

export type DRole = {
    id: number;
    authority: string;
}