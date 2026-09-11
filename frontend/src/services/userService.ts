import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";
import { DUser } from "../models/user";
import qs from "qs";

const route = "/api/user";

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

export function pesquisarPorEmail(email: string) {
    return requestBackend({ 
        url: `${route}/email/${email}`, 
        withCredentials: true  
    });
}

export function findMe() {
    return requestBackend({ 
        url: `${route}/me`, 
        withCredentials: true  
    });
}

export function pesquisarHistorico(codigo: number) {
    const config : AxiosRequestConfig = {
        method: "GET",
        url: `${route}/historico`,
        params: {
            codigo
        },
        withCredentials: true
    }

    return requestBackend(config);
}

export function pesquisarAtributosEditaveisEmLote() {
    return requestBackend({ 
        url: `${route}/atributoseditaveisemlote`, 
        withCredentials: true 
    });
}

export function criar(obj: DUser) {
    const config: AxiosRequestConfig = {
        method: "POST",
        url: `${route}`,
        data: obj
    }

    return requestBackend(config);
}

export function atualizar(obj: DUser) {
    const config: AxiosRequestConfig = {
        method: "PUT",
        url: `${route}`,
        withCredentials: true,
        data: obj
    }

    return requestBackend(config);
}

export function atualizarSenha(newPassword: string, oldPassword: string) {
    const config: AxiosRequestConfig = {
        method: "PUT",
        url: `${route}/password`,
        withCredentials: true,
        params: {
            newPassword,
            oldPassword
        }
    }

    return requestBackend(config);
}

export function substituirVersao(codigoRegistro: number, codigoVersao: number) {
    const config : AxiosRequestConfig = {
        method: "PUT",
        url: `${route}/substituir`,
        params: {
            codigoRegistro,
            codigoVersao
        },
        withCredentials: true
    }

    return requestBackend(config);
}

export function inativar(codigo: number[]) {
    const config : AxiosRequestConfig = {
        method: "PATCH",
        url: `${route}/inativar`,
        withCredentials: true,
        params: {
            codigo
        },
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" })
    }

    return requestBackend(config);
}

export function remover(codigo: number[]) {
    const config : AxiosRequestConfig = {
        method: "DELETE",
        url: `${route}`,
        withCredentials: true,
        params: {
            codigo
        },
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" })
    }

    return requestBackend(config);
}