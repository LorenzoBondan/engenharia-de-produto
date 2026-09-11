import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";

const route = "/api/lixeira";

export function pesquisarTodos(colunas: string, operacoes: string, valores: string, page?: number, pageSize?: number, sort?: string) {
    sort = sort || "codigo;d";
    
    const config : AxiosRequestConfig = {
        method: "GET",
        url: `${route}`,
        params: {
            colunas,
            operacoes,
            valores,
            sort,
            page,
            pageSize
        },
        withCredentials: true
    }

    return requestBackend(config);
}

export function recuperarPorId(id: number, recuperarDependencias: boolean) {
    return requestBackend({
        method: "GET",
        url: `${route}/recuperar/${id}`,
        withCredentials: true,
        params: {recuperarDependencias}
    });
}

export function recuperarPorEntidadeId(entidadeid: any, recuperarDependencias: boolean) {
    const config: AxiosRequestConfig = {
        method: "POST",
        url: `${route}/recuperarporentidadeid`,
        withCredentials: true,
        params: {recuperarDependencias},
        data: entidadeid
    }

    return requestBackend(config);
}