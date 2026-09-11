import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import './styles.css';

type Props = {
    message: string;
    onDialogClose: Function;
    type?: 'success' | 'error' | 'info';
}

export default function DialogInfo({ message, onDialogClose, type = 'info' }: Props) {

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={32} />;
            case 'error':
                return <AlertCircle size={32} />;
            default:
                return <Info size={32} />;
        }
    };

    const getTitle = () => {
        switch (type) {
            case 'success':
                return 'Sucesso';
            case 'error':
                return 'Erro';
            default:
                return 'Informação';
        }
    };

    return (
        <div className="dialog-info-overlay" onClick={() => onDialogClose()}>
            <div className="dialog-info-modal" onClick={(event) => event.stopPropagation()}>
                <div className={`dialog-info-header dialog-info-header-${type}`}>
                    <div className={`dialog-info-icon dialog-info-icon-${type}`}>
                        {getIcon()}
                    </div>
                    <h2 className="dialog-info-title">{getTitle()}</h2>
                </div>

                <div className="dialog-info-content">
                    <p className="dialog-info-message">{message}</p>
                </div>

                <div className="dialog-info-actions">
                    <button
                        className={`dialog-info-btn dialog-info-btn-${type}`}
                        onClick={() => onDialogClose()}
                    >
                        <X size={18} />
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    )
}
