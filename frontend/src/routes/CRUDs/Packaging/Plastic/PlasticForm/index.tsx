import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import 'flatpickr/dist/themes/material_red.css';
import Flatpickr from "react-flatpickr";
import FormInput from '../../../../../components/FormInput';
import FormSelect from '../../../../../components/FormSelect';
import * as forms from '../../../../../utils/forms';
import FormLabel from '../../../../../components/FormLabel';
import { usePlasticForm } from '../../../../../hooks/crud/usePlasticForm';
import { LoadingButton } from '../../../../../components/Loading';
import { HistoryButton, HistoryModal } from '../../../../../components/history';
import * as plasticoService from '../../../../../services/plasticoService';

export default function PlasticForm() {
    const params = useParams();
    const plasticId = params.plasticId !== 'create' ? Number(params.plasticId) : undefined;
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const {
        formData,
        loading,
        setFormData,
        handleInputChange,
        handleTurnDirty,
        handleSubmit,
        tipoMaterialOptions,
        dateTimeStart,
        handleDateTimeStartChange,
    } = usePlasticForm();  
    
    return(
        <main>
            <section id="form-section" className="container">
                <div className="form-container">
                    <form className="card form" onSubmit={handleSubmit}>
                        <h2>Plástico</h2>
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
                                <FormLabel text="Tipo de Material" isRequired />
                                <FormSelect
                                    {...formData.tipoMaterial}
                                    className="form-control form-select-container"
                                    options={tipoMaterialOptions}
                                    value={formData.tipoMaterial.value}
                                    onChange={(selectedOption: any) => {
                                        const newFormData = forms.updateAndValidate(
                                            formData,
                                            "tipoMaterial",
                                            selectedOption
                                        );
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                />
                                <div className="form-error">{formData.tipoMaterial.message}</div>
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
                            <div>
                                <FormLabel text="Porcentagem de Perda (%)" isRequired />
                                <FormInput
                                    {...formData.porcentagemPerda}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.porcentagemPerda.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Implantação" />
                                <Flatpickr
                                    id="implantacao"
                                    name="implantacao"
                                    value={dateTimeStart}
                                    onChange={(selectedDateTime: Date[]) => handleDateTimeStartChange(selectedDateTime)}
                                    options={{
                                        enableTime: false,
                                        dateFormat: 'Y-m-d',
                                    }}
                                    className="form-control"
                                />
                          </div>
                          <div>
                                <FormLabel text="Gramatura" isRequired />
                                <FormInput
                                    {...formData.gramatura}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.gramatura.message}</div>
                            </div>
                        </div>
                        <div className="form-buttons">
                            <Link to="/plastics">
                                <button type="reset" className="btn btn-white">Cancelar</button>
                            </Link>
                            {plasticId && (
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

            {plasticId && (
                <HistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={() => setIsHistoryModalOpen(false)}
                    entityId={plasticId}
                    fetchHistoryFn={plasticoService.pesquisarHistorico}
                    entityName={`Plástico - ${formData.descricao.value || plasticId}`}
                />
            )}
        </main>
    );
}