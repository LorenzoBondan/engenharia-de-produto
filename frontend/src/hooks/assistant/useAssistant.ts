import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import * as assistantService from '../../services/assistantService';

export interface Message {
    role: 'user' | 'assistant' | 'error';
    content: string;
    timestamp: number;
}

export interface UseAssistantReturn {
    messages: Message[];
    loading: boolean;
    sendMessage: (message: string) => Promise<void>;
    clearMessages: () => void;
}

/**
 * Custom hook for AI Assistant integration
 *
 * Features:
 * - Manages conversation state (messages, loading)
 * - Auto-detects current page context (pathname)
 * - Sends messages to backend and stores responses
 * - Error handling with user-friendly messages
 *
 * @returns Assistant state and message handlers
 *
 * @example
 * ```tsx
 * function ChatWidget() {
 *   const { messages, loading, sendMessage, clearMessages } = useAssistant();
 *
 *   async function handleSend(text: string) {
 *     await sendMessage(text);
 *   }
 *
 *   return (
 *     <div>
 *       {messages.map((msg, i) => (
 *         <div key={i} className={msg.role}>{msg.content}</div>
 *       ))}
 *       {loading && <div>Carregando...</div>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAssistant(): UseAssistantReturn {
    const location = useLocation();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    /**
     * Send message to assistant and update conversation
     */
    const sendMessage = useCallback(async (message: string): Promise<void> => {
        if (!message.trim()) {
            return;
        }

        // Add user message
        const userMessage: Message = {
            role: 'user',
            content: message,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, userMessage]);

        // Call backend
        setLoading(true);
        try {
            const response = await assistantService.enviarMensagem({
                message,
                pageContext: location.pathname
            });

            // Add assistant response
            const assistantMessage: Message = {
                role: 'assistant',
                content: response.data.reply,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error: any) {
            // Handle errors
            let errorMessage = 'Desculpe, ocorreu um erro ao processar sua mensagem.';

            if (error.response?.status === 503) {
                errorMessage = 'O assistente está temporariamente indisponível. Tente novamente em alguns instantes.';
            } else if (error.response?.status === 504) {
                errorMessage = 'O assistente demorou muito para responder. Tente novamente ou reformule sua pergunta.';
            } else if (error.response?.status === 401) {
                errorMessage = 'Você precisa estar autenticado para usar o assistente.';
            }

            const errorMessageObj: Message = {
                role: 'error',
                content: errorMessage,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMessageObj]);
        } finally {
            setLoading(false);
        }
    }, [location.pathname]);

    /**
     * Clear conversation history
     */
    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    return {
        messages,
        loading,
        sendMessage,
        clearMessages
    };
}
