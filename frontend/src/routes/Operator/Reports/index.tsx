import { useState } from 'react';
import { FileText, Download, AlertCircle, XCircle } from 'lucide-react';
import './styles.css';
import DownloadButton from './DownloadButton';

const Reports = () => {
    const [id, setId] = useState<number>(0);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDownload = (url: string) => {
        setPdfUrl(url);
        setError(null); // Limpa erro se download foi bem sucedido
    };

    const handleError = (errorMessage: string | null) => {
        setError(errorMessage);
        setPdfUrl(null); // Limpa PDF se houver erro
    };

    const clearError = () => {
        setError(null);
    };

    return (
        <div className="reports-main">
            <div className="reports-container">
                {/* Header Card */}
                <div className="reports-header-card">
                    <div className="reports-header-content">
                        <div className="reports-icon-wrapper">
                            <FileText size={32} />
                        </div>
                        <div className="reports-header-info">
                            <h1 className="reports-title">Relatórios</h1>
                            <p className="reports-subtitle">Gere relatórios em PDF dos itens cadastrados</p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="reports-form-card">
                    <form className="reports-form">
                        <div className="form-field">
                            <label className="form-label">
                                Código do Filho
                            </label>
                            <input
                                type="number"
                                value={id}
                                onChange={(e) => {
                                    setId(parseInt(e.target.value));
                                    clearError(); // Limpa erro quando usuário digita
                                }}
                                className='form-input'
                                placeholder="Digite o código do filho"
                            />
                        </div>
                        <DownloadButton id={id} onDownload={handleDownload} onError={handleError} />
                    </form>
                </div>

                {/* Error Card */}
                {error && (
                    <div className="reports-error-card">
                        <div className="reports-error-content">
                            <div className="reports-error-icon">
                                <AlertCircle size={24} />
                            </div>
                            <div className="reports-error-info">
                                <h3 className="reports-error-title">Erro ao gerar relatório</h3>
                                <p className="reports-error-message">
                                    {error}. Verifique se o código informado está correto e tente novamente.
                                </p>
                            </div>
                            <button
                                className="reports-error-close"
                                onClick={clearError}
                                title="Fechar mensagem"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {/* PDF Viewer */}
                {pdfUrl && !error && (
                    <div className="reports-pdf-card">
                        <div className="reports-pdf-header">
                            <h3 className="reports-pdf-title">Visualização do Relatório</h3>
                            <a
                                href={pdfUrl}
                                download
                                className="reports-pdf-download-link"
                                title="Baixar PDF"
                            >
                                <Download size={20} />
                                Baixar
                            </a>
                        </div>
                        <iframe
                            src={pdfUrl}
                            className="reports-pdf-viewer"
                            title="Relatório PDF"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Reports;
