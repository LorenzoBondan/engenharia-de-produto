import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import 'flatpickr/dist/themes/material_red.css';
import Flatpickr from "react-flatpickr";
import FormInput from '../../../../../components/FormInput';
import FormSelect from '../../../../../components/FormSelect';
import * as forms from '../../../../../utils/forms';
import FormLabel from '../../../../../components/FormLabel';
import { useSonForm } from '../../../../../hooks/crud/useSonForm';
import { LoadingButton } from '../../../../../components/Loading';
import { HistoryButton, HistoryModal } from '../../../../../components/history';
import * as filhoService from '../../../../../services/filhoService';

export default function SonForm() {
    const params = useParams();
    const sonId = params.sonId !== 'create' ? Number(params.sonId) : undefined;
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const {
        formData,
        loading,
        setFormData,
        handleInputChange,
        handleTurnDirty,
        handleSubmit,
        cores,
        pais,
        roteiros,
        tipoFilhoOptions,
        dateTimeStart,
        handleDateTimeStartChange,
    } = useSonForm();
    
    return(
        <main>
            <section id="form-section" className="container">
                <div className="form-container">
                    <form className="card form" onSubmit={handleSubmit}>
                        <h2>Filho</h2>
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
                                <FormLabel text="Pai" />
                                <FormSelect
                                    {...formData.pai}
                                    className="form-control form-select-container"
                                    options={pais}
                                    value={formData.pai.value}
                                    onChange={(selectedOption: any) => {
                                        const newFormData = forms.updateAndValidate(
                                            formData,
                                            "pai",
                                            selectedOption
                                        );
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                    getOptionLabel={(obj: any) => obj.descricao}
                                    getOptionValue={(obj: any) => String(obj.codigo)}
                                />
                                <div className="form-error">{formData.pai.message}</div>
                            </div>
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
                            <div>
                                <FormLabel text="Cor" />
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
                                <FormLabel text="Roteiro" />
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
                                <FormLabel text="Valor (R$)" />
                                <FormInput
                                    {...formData.valor}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.valor.message}</div>
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
                                <FormLabel text="Tipo de Filho" isRequired />
                                <FormSelect
                                    {...formData.tipo}
                                    className="form-control form-select-container"
                                    options={tipoFilhoOptions}
                                    value={formData.tipo.value}
                                    onChange={(selectedOption: any) => {
                                        const newFormData = forms.updateAndValidate(
                                            formData,
                                            "tipo",
                                            selectedOption
                                        );
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                />
                                <div className="form-error">{formData.tipo.message}</div>
                            </div>
                        </div>
                        <div className="form-buttons">
                            <Link to="/sons">
                                <button type="reset" className="btn btn-white">Cancelar</button>
                            </Link>
                            {sonId && (
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

            {sonId && (
                <HistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={() => setIsHistoryModalOpen(false)}
                    entityId={sonId}
                    fetchHistoryFn={filhoService.pesquisarHistorico}
                    entityName={`Filho - ${formData.descricao.value || sonId}`}
                />
            )}
        </main>
    );
}