import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import 'flatpickr/dist/themes/material_red.css';
import FormInput from '../../../../../components/FormInput';
import FormLabel from '../../../../../components/FormLabel';
import { useColorForm } from '../../../../../hooks/crud/useColorForm';
import { LoadingButton } from '../../../../../components/Loading';
import { HistoryButton, HistoryModal } from '../../../../../components/history';
import * as corService from '../../../../../services/corService';

export default function ColorForm() {
    const params = useParams();
    const colorId = params.colorId !== 'create' ? Number(params.colorId) : undefined;
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const { formData, loading, handleInputChange, handleTurnDirty, handleSubmit } = useColorForm(); 
    
    return(
        <main>
            <section id="form-section" className="container">
                <div className="form-container">
                    <form className="card form" onSubmit={handleSubmit}>
                        <h2>Cor</h2>
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
                            <div>
                                <FormLabel text="Hexa" />
                                <FormInput
                                    {...formData.hexa}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.hexa.message}</div>
                            </div>
                        </div>
                        <div className="form-buttons">
                            <Link to="/colors">
                                <button type="reset" className="btn btn-white">Cancelar</button>
                            </Link>
                            {colorId && (
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

            {colorId && (
                <HistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={() => setIsHistoryModalOpen(false)}
                    entityId={colorId}
                    fetchHistoryFn={corService.pesquisarHistorico}
                    entityName={`Cor - ${formData.descricao.value || colorId}`}
                />
            )}
        </main>
    );
}