import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";

const route = "/api/role";

export function pesquisarTodos(colunas: string, operacoes: string, valores: string, page?: number, pageSize?: number, sort?: string) {
    sort = sort || "id;d";
    
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

export function pesquisarPorId(id: number) {
    return requestBackend({ 
        url: `${route}/${id}`, 
        withCredentials: true 
    });
}