import { format } from 'date-fns';
import './styles.css';

interface Message {
    role: 'user' | 'assistant' | 'error';
    content: string;
    timestamp: number;
}

type Props = {
    message: Message;
};

export default function MessageBubble({ message }: Props) {
    const formattedTime = format(message.timestamp, 'HH:mm');

    return (
        <div className={`message-bubble message-bubble-${message.role}`}>
            <div className="message-content">{message.content}</div>
            <div className="message-timestamp">{formattedTime}</div>
        </div>
    );
}
