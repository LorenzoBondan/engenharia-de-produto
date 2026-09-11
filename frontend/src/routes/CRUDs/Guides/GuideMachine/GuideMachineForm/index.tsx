import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import * as forms from '../../../../../utils/forms';
import FormLabel from '../../../../../components/FormLabel';
import FormInput from '../../../../../components/FormInput';
import FormSelect from '../../../../../components/FormSelect';
import { useGuideMachineForm } from '../../../../../hooks/crud/useGuideMachineForm';
import { LoadingButton } from '../../../../../components/Loading';
import { HistoryButton, HistoryModal } from '../../../../../components/history';
import * as roteiroMaquinaService from '../../../../../services/roteiroMaquinaService';

export default function GuideMachineForm() {
    const params = useParams();
    const guideMachineId = params.guideMachineId !== 'create' ? Number(params.guideMachineId) : undefined;
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const {
        formData,
        loading,
        setFormData,
        handleInputChange,
        handleTurnDirty,
        handleSubmit,
        roteiros,
        maquinas,
        previousPath,
    } = useGuideMachineForm();
    
    return(
        <main>
            <section id="form-section" className="container">
                <div className="form-container">
                    <form className="card form" onSubmit={handleSubmit}>
                        <h2>Roteiro Máquina</h2>
                        <div className="form-controls-container">
                            <div>
                                <FormLabel text="Roteiro" isRequired />
                                <FormSelect
                                    {...formData.roteiro}
                                    className="form-control form-select-container"
                                    options={roteiros}
                                    value={formData.roteiro.value}
                                    onChange={(selectedOption: any) => {
                                        const newFormData = forms.updateAndValidate(
                                            formData,
                                            "roteiro",
                                            selectedOption
                                        );
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                    getOptionLabel={(obj: any) => obj.descricao}
                                    getOptionValue={(obj: any) => String(obj.codigo)}
                                />
                                <div className="form-error">{formData.roteiro.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Máquina" isRequired />
                                <FormSelect
                                    {...formData.maquina}
                                    className="form-control form-select-container"
                                    options={maquinas}
                                    value={formData.maquina.value}
                                    onChange={(selectedOption: any) => {
                                        const newFormData = forms.updateAndValidate(
                                            formData,
                                            "maquina",
                                            selectedOption
                                        );
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                    getOptionLabel={(obj: any) => obj.descricao}
                                    getOptionValue={(obj: any) => String(obj.codigo)}
                                />
                                <div className="form-error">{formData.maquina.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Tempo Homem" />
                                <FormInput
                                    {...formData.tempoHomem}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.tempoHomem.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Tempo Maquina" />
                                <FormInput
                                    {...formData.tempoMaquina}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.tempoMaquina.message}</div>
                            </div>
                        </div>
                        <div className="form-buttons">
                            <Link to={previousPath}>
                                <button type="reset" className="btn btn-white">Cancelar</button>
                            </Link>
                            {guideMachineId && (
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

            {guideMachineId && (
                <HistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={() => setIsHistoryModalOpen(false)}
                    entityId={guideMachineId}
                    fetchHistoryFn={roteiroMaquinaService.pesquisarHistorico}
                    entityName={`Roteiro Máquina - ${formData.roteiro.value?.descricao || guideMachineId}`}
                />
            )}
        </main>
    );
}