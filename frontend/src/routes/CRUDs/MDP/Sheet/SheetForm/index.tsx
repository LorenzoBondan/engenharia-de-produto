import { Link } from 'react-router-dom';
import { useState } from 'react';
import 'flatpickr/dist/themes/material_red.css';
import Flatpickr from "react-flatpickr";
import FormInput from '../../../../../components/FormInput';
import FormSelect from '../../../../../components/FormSelect';
import * as forms from '../../../../../utils/forms';
import FormLabel from '../../../../../components/FormLabel';
import { useSheetForm } from '../../../../../hooks/crud/useSheetForm';
import { LoadingButton } from '../../../../../components/Loading';
import { HistoryButton, HistoryModal } from '../../../../../components/history';
import * as chapaService from '../../../../../services/chapaService';
import { useParams } from 'react-router-dom';

export default function SheetForm() {
    const params = useParams();
    const sheetId = params.sheetId !== 'create' ? Number(params.sheetId) : undefined;
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const {
        formData,
        loading,
        setFormData,
        handleInputChange,
        handleTurnDirty,
        handleSubmit,
        cores,
        tipoMaterialOptions,
        dateTimeStart,
        handleDateTimeStartChange,
    } = useSheetForm();

    return(
        <main>
            <section id="form-section" className="container">
                <div className="form-container">
                    <form className="card form" onSubmit={handleSubmit}>
                        <h2>Chapa</h2>
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
                                <FormLabel text="Cor" isRequired />
                                <FormSelect
                                    {...formData.cor}
                                    className="form-control form-select-container"
                                    options={cores}
                                    value={formData.cor.value}
                                    onChange={(selectedOption: any) => {
                                        const newFormData = forms.updateAndValidate(
                                            formData,
                                            "cor",
                                            selectedOption
                                        );
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                    getOptionLabel={(obj: any) => obj.descricao}
                                    getOptionValue={(obj: any) => String(obj.codigo)}
                                />
                                <div className="form-error">{formData.cor.message}</div>
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
                                <FormLabel text="Espessura (mm)" isRequired />
                                <FormInput
                                    {...formData.espessura}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.espessura.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Faces" isRequired />
                                <FormInput
                                    {...formData.faces}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.faces.message}</div>
                            </div>
                        </div>
                        <div className="form-buttons">
                            <Link to="/sheets">
                                <button type="reset" className="btn btn-white">Cancelar</button>
                            </Link>
                            {sheetId && (
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

            {sheetId && (
                <HistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={() => setIsHistoryModalOpen(false)}
                    entityId={sheetId}
                    fetchHistoryFn={chapaService.pesquisarHistorico}
                    entityName={`Chapa - ${formData.descricao.value || sheetId}`}
                />
            )}
        </main>
    );
}