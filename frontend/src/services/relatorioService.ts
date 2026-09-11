import { requestBackend } from "../utils/requests";

const route = "/api/relatorio";

export function gerarRelatorioPdf(id: number) {
    return requestBackend({ 
        url: `${route}/${id}`, 
        withCredentials: true,
        responseType: 'blob'
    });
}