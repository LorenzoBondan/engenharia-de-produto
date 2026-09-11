import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";
import { DMaterialUsado } from "../models/materialUsado";
import qs from "qs";

const route = "/api/materialusado";

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

export function pesquisarPorId(id: number) {
    return requestBackend({ 
        url: `${route}/${id}`,
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

export function criar(obj: DMaterialUsado) {
    const config: AxiosRequestConfig = {
        method: "POST",
        url: `${route}`,
        withCredentials: true,
        data: obj
    }

    return requestBackend(config);
}

export function atualizar(obj: DMaterialUsado) {
    const config: AxiosRequestConfig = {
        method: "PUT",
        url: `${route}`,
        withCredentials: true,
        data: obj
    }

    return requestBackend(config);
}

export function atualizarEmLote(codigo: number, atributo: string, valor: string) {
    const config : AxiosRequestConfig = {
        method: "PUT",
        url: `${route}/atualizaremlote`,
        params: {
            codigo,
            atributo,
            valor
        },
        withCredentials: true
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