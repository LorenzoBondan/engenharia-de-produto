import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import 'flatpickr/dist/themes/material_red.css';
import FormInput from '../../../../../components/FormInput';
import FormLabel from '../../../../../components/FormLabel';
import { useMeasureForm } from '../../../../../hooks/crud/useMeasureForm';
import { LoadingButton } from '../../../../../components/Loading';
import { HistoryButton, HistoryModal } from '../../../../../components/history';
import * as medidasService from '../../../../../services/medidasService';

export default function MeasureForm() {
    const params = useParams();
    const measureId = params.measureId !== 'create' ? Number(params.measureId) : undefined;
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const { formData, loading, handleInputChange, handleTurnDirty, handleSubmit } = useMeasureForm(); 
    
    return(
        <main>
            <section id="form-section" className="container">
                <div className="form-container">
                    <form className="card form" onSubmit={handleSubmit}>
                        <h2>Medidas</h2>
                        <div className="form-controls-container">
                            <div>
                                <FormLabel text="Altura (mm)" isRequired/>
                                <FormInput
                                    {...formData.altura}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.altura.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Largura (mm)" isRequired/>
                                <FormInput
                                    {...formData.largura}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.largura.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Espessura (mm)" isRequired/>
                                <FormInput
                                    {...formData.espessura}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.espessura.message}</div>
                            </div>
                        </div>
                        <div className="form-buttons">
                            <Link to="/measures">
                                <button type="reset" className="btn btn-white">Cancelar</button>
                            </Link>
                            {measureId && (
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

            {measureId && (
                <HistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={() => setIsHistoryModalOpen(false)}
                    entityId={measureId}
                    fetchHistoryFn={medidasService.pesquisarHistorico}
                    entityName={`Medidas - ${formData.altura.value}x${formData.largura.value}x${formData.espessura.value} mm`}
                />
            )}
        </main>
    );
}