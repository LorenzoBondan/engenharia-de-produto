import { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { useAssistant } from '../../../hooks/assistant/useAssistant';
import MessageBubble from '../MessageBubble';
import './styles.css';

export default function ChatWidget() {
    const { messages, loading, sendMessage, clearMessages } = useAssistant();
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || loading) {
            return;
        }

        const message = inputValue.trim();
        setInputValue('');
        await sendMessage(message);
    };

    const handleClear = () => {
        clearMessages();
    };

    return (
        <div className="chat-widget">
            {!isOpen && (
                <button
                    className="chat-widget-button"
                    onClick={handleToggle}
                    aria-label="Abrir assistente"
                >
                    <FiMessageCircle size={24} />
                </button>
            )}

            {isOpen && (
                <div className="chat-widget-container">
                    <div className="chat-widget-header">
                        <h3>Assistente IA</h3>
                        <div className="chat-widget-header-actions">
                            {messages.length > 0 && (
                                <button
                                    onClick={handleClear}
                                    className="chat-widget-clear-btn"
                                    aria-label="Limpar conversa"
                                >
                                    Limpar
                                </button>
                            )}
                            <button
                                onClick={handleToggle}
                                className="chat-widget-close-btn"
                                aria-label="Fechar assistente"
                            >
                                <FiX size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="chat-widget-messages">
                        {messages.length === 0 && (
                            <div className="chat-widget-welcome">
                                <p>Olá! Sou seu assistente IA.</p>
                                <p>Como posso ajudá-lo hoje?</p>
                            </div>
                        )}

                        {messages.map((msg, index) => (
                            <MessageBubble key={index} message={msg} />
                        ))}

                        {loading && (
                            <div className="chat-widget-loading">
                                <span className="chat-widget-loading-dot"></span>
                                <span className="chat-widget-loading-dot"></span>
                                <span className="chat-widget-loading-dot"></span>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chat-widget-input-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Digite sua mensagem..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={loading}
                            maxLength={2000}
                            className="chat-widget-input"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || loading}
                            className="chat-widget-send-btn"
                            aria-label="Enviar mensagem"
                        >
                            <FiSend size={20} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
