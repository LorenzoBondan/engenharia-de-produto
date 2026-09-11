import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import 'flatpickr/dist/themes/material_red.css';
import FormInput from '../../../../../components/FormInput';
import FormSelect from '../../../../../components/FormSelect';
import * as forms from '../../../../../utils/forms';
import FormLabel from '../../../../../components/FormLabel';
import FormTextArea from '../../../../../components/FormTextArea';
import { useMachineForm } from '../../../../../hooks/crud/useMachineForm';
import { LoadingButton } from '../../../../../components/Loading';
import { HistoryButton, HistoryModal } from '../../../../../components/history';
import * as maquinaService from '../../../../../services/maquinaService';

export default function MachineForm() {
    const params = useParams();
    const machineId = params.machineId !== 'create' ? Number(params.machineId) : undefined;
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const {
        formData,
        loading,
        setFormData,
        handleInputChange,
        handleTurnDirty,
        handleSubmit,
        grupoMaquinas,
    } = useMachineForm();
    
    return(
        <main>
            <section id="form-section" className="container">
                <div className="form-container">
                    <form className="card form" onSubmit={handleSubmit}>
                        <h2>Máquina</h2>
                        <div className="form-controls-container">
                            <div>
                                <FormLabel text="Nome" isRequired />
                                <FormInput
                                    {...formData.nome}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.nome.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Fórmula" isRequired />
                                <FormTextArea
                                    {...formData.formula}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.formula.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Grupo Máquina" isRequired/>
                                <FormSelect
                                    {...formData.grupoMaquina}
                                    className="form-control form-select-container"
                                    options={grupoMaquinas}
                                    value={formData.grupoMaquina.value}
                                    onChange={(selectedOption: any) => {
                                        const newFormData = forms.updateAndValidate(
                                            formData,
                                            "grupoMaquina",
                                            selectedOption
                                        );
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                    getOptionLabel={(obj: any) => obj.nome}
                                    getOptionValue={(obj: any) => String(obj.codigo)}
                                />
                                <div className="form-error">{formData.grupoMaquina.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Valor (R$)" isRequired />
                                <FormInput
                                    {...formData.valor}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.valor.message}</div>
                            </div>
                        </div>
                        <div className="form-buttons">
                            <Link to="/machines">
                                <button type="reset" className="btn btn-white">Cancelar</button>
                            </Link>
                            {machineId && (
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

            {machineId && (
                <HistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={() => setIsHistoryModalOpen(false)}
                    entityId={machineId}
                    fetchHistoryFn={maquinaService.pesquisarHistorico}
                    entityName={`Máquina - ${formData.nome.value || machineId}`}
                />
            )}
        </main>
    );
}