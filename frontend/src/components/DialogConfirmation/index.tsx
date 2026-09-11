import { HelpCircle, X, Check } from 'lucide-react';
import './styles.css';

type Props = {
    id: number | number[];
    message: string;
    onDialogAnswer: (answer: boolean, id: number | number[]) => void;
};

export default function DialogConfirmation({ id, message, onDialogAnswer }: Props) {

    return (
        <div className="dialog-confirmation-overlay" onClick={() => onDialogAnswer(false, id)}>
            <div className="dialog-confirmation-modal" onClick={(event) => event.stopPropagation()}>
                <div className="dialog-confirmation-header">
                    <div className="dialog-confirmation-icon">
                        <HelpCircle size={32} />
                    </div>
                    <h2 className="dialog-confirmation-title">Confirmação</h2>
                </div>

                <div className="dialog-confirmation-content">
                    <p className="dialog-confirmation-message">{message}</p>
                </div>

                <div className="dialog-confirmation-actions">
                    <button
                        className="dialog-confirmation-btn dialog-confirmation-btn-cancel"
                        onClick={() => onDialogAnswer(false, id)}
                    >
                        <X size={18} />
                        Não
                    </button>
                    <button
                        className="dialog-confirmation-btn dialog-confirmation-btn-confirm"
                        onClick={() => onDialogAnswer(true, id)}
                    >
                        <Check size={18} />
                        Sim
                    </button>
                </div>
            </div>
        </div>
    )
}
