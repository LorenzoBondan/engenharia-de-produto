import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";

const route = "/api/assistant";

export interface ChatRequestDTO {
    message: string;
    pageContext?: string;
}

export interface ChatResponseDTO {
    reply: string;
    conversationId: number;
}

export function enviarMensagem(request: ChatRequestDTO) {
    const config: AxiosRequestConfig = {
        method: "POST",
        url: `${route}/chat`,
        withCredentials: true,
        data: request
    };

    return requestBackend(config);
}
