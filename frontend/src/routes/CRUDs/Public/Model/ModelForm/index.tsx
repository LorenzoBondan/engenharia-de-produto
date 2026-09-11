import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import 'flatpickr/dist/themes/material_red.css';
import FormInput from '../../../../../components/FormInput';
import FormLabel from '../../../../../components/FormLabel';
import { useModelForm } from '../../../../../hooks/crud/useModelForm';
import { LoadingButton } from '../../../../../components/Loading';
import { HistoryButton, HistoryModal } from '../../../../../components/history';
import * as modeloService from '../../../../../services/modeloService';

export default function ModelForm() {
    const params = useParams();
    const modelId = params.modelId !== 'create' ? Number(params.modelId) : undefined;
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const { formData, loading, handleInputChange, handleTurnDirty, handleSubmit } = useModelForm(); 
    
    return(
        <main>
            <section id="form-section" className="container">
                <div className="form-container">
                    <form className="card form" onSubmit={handleSubmit}>
                        <h2>Modelo</h2>
                        <div className="form-controls-container">
                            <div>
                                <FormLabel text="Descrição" isRequired />
                                <FormInput
                                    {...formData.descricao}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.descricao.message}</div>
                            </div>
                        </div>
                        <div className="form-buttons">
                            <Link to="/models">
                                <button type="reset" className="btn btn-white">Cancelar</button>
                            </Link>
                            {modelId && (
                                <HistoryButton onClick={() => setIsHistoryModalOpen(true)} />
                            )}
                            <LoadingButton
                                loading={loading}
                                text="Salvar"
                                loadingText="Salvando..."
                                variant="primary"
                            />
                        </div>
                    </form>
                </div>
            </section>

            {modelId && (
                <HistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={() => setIsHistoryModalOpen(false)}
                    entityId={modelId}
                    fetchHistoryFn={modeloService.pesquisarHistorico}
                    entityName={`Modelo - ${formData.descricao.value || modelId}`}
                />
            )}
        </main>
    );
}