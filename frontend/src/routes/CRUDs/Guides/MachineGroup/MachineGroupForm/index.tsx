import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import 'flatpickr/dist/themes/material_red.css';
import FormInput from '../../../../../components/FormInput';
import FormLabel from '../../../../../components/FormLabel';
import { useMachineGroupForm } from '../../../../../hooks/crud/useMachineGroupForm';
import { LoadingButton } from '../../../../../components/Loading';
import { HistoryButton, HistoryModal } from '../../../../../components/history';
import * as grupoMaquinaService from '../../../../../services/grupoMaquinaService';

export default function MachineGroupForm() {
    const params = useParams();
    const machineGroupId = params.machineGroupId !== 'create' ? Number(params.machineGroupId) : undefined;
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const {
        formData,
        loading,
        handleInputChange,
        handleTurnDirty,
        handleSubmit,
    } = useMachineGroupForm(); 
    
    return(
        <main>
            <section id="form-section" className="container">
                <div className="form-container">
                    <form className="card form" onSubmit={handleSubmit}>
                        <h2>Grupo de Máquina</h2>
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
                        </div>
                        <div className="form-buttons">
                            <Link to="/machinegroups">
                                <button type="reset" className="btn btn-white">Cancelar</button>
                            </Link>
                            {machineGroupId && (
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

            {machineGroupId && (
                <HistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={() => setIsHistoryModalOpen(false)}
                    entityId={machineGroupId}
                    fetchHistoryFn={grupoMaquinaService.pesquisarHistorico}
                    entityName={`Grupo de Máquina - ${formData.nome.value || machineGroupId}`}
                />
            )}
        </main>
    );
}