import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import 'flatpickr/dist/themes/material_red.css';
import FormInput from '../../../../../components/FormInput';
import FormSelect from '../../../../../components/FormSelect';
import * as forms from '../../../../../utils/forms';
import FormLabel from '../../../../../components/FormLabel';
import FormCheckbox from '../../../../../components/FormCheckBox';
import { useFatherForm } from '../../../../../hooks/crud/useFatherForm';
import { LoadingButton } from '../../../../../components/Loading';
import { HistoryButton, HistoryModal } from '../../../../../components/history';
import * as paiService from '../../../../../services/paiService';

export default function FatherForm() {
    const params = useParams();
    const fatherId = params.fatherId !== 'create' ? Number(params.fatherId) : undefined;
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const {
        formData,
        loading,
        setFormData,
        handleInputChange,
        handleTurnDirty,
        handleSubmit,
        modelos,
        categoriaComponentes,
        tipoPinturaOptions,
    } = useFatherForm();

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setFormData((prevState: any) => ({
            ...prevState,
            [name]: {
                ...prevState[name],
                value: checked
            }
        }));
    };
    
    return(
        <main>
            <section id="form-section" className="container">
                <div className="form-container">
                    <form className="card form" onSubmit={handleSubmit}>
                        <h2>Pai</h2>
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
                                <FormLabel text="Modelo" isRequired/>
                                <FormSelect
                                    {...formData.modelo}
                                    className="form-control form-select-container"
                                    options={modelos}
                                    value={formData.modelo.value}
                                    onChange={(selectedOption: any) => {
                                        const newFormData = forms.updateAndValidate(
                                            formData,
                                            "modelo",
                                            selectedOption
                                        );
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                    getOptionLabel={(obj: any) => obj.descricao}
                                    getOptionValue={(obj: any) => String(obj.codigo)}
                                />
                                <div className="form-error">{formData.modelo.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Categoria Componente" isRequired/>
                                <FormSelect
                                    {...formData.categoriaComponente}
                                    className="form-control form-select-container"
                                    options={categoriaComponentes}
                                    value={formData.categoriaComponente.value}
                                    onChange={(selectedOption: any) => {
                                        const newFormData = forms.updateAndValidate(
                                            formData,
                                            "categoriaComponente",
                                            selectedOption
                                        );
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                    getOptionLabel={(obj: any) => obj.descricao}
                                    getOptionValue={(obj: any) => String(obj.codigo)}
                                />
                                <div className="form-error">{formData.categoriaComponente.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Bordas Comprimento" />
                                <FormInput
                                    {...formData.bordasComprimento}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.bordasComprimento.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Bordas Largura" />
                                <FormInput
                                    {...formData.bordasLargura}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.bordasLargura.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Número Cantoneiras" />
                                <FormInput
                                    {...formData.numeroCantoneiras}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.numeroCantoneiras.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Plástico Adicional" />
                                <FormInput
                                    {...formData.plasticoAdicional}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.plasticoAdicional.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Largura Plastico" />
                                <FormInput
                                    {...formData.larguraPlastico}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.larguraPlastico.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Faces" />
                                <FormInput
                                    {...formData.faces}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.faces.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Tipo de Pintura" isRequired />    
                                <FormSelect
                                    {...formData.tipoPintura}
                                    className="form-control form-select-container"
                                    options={tipoPinturaOptions}
                                    value={formData.tipoPintura.value}
                                    onChange={(selectedOption: any) => {
                                        const newFormData = forms.updateAndValidate(
                                            formData,
                                            "tipoPintura",
                                            selectedOption
                                        );
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                />
                                <div className="form-error">{formData.tipoPintura.message}</div>
                            </div>
                            <div>
                                <FormCheckbox
                                    id={formData.plasticoAcima.id}
                                    name={formData.plasticoAcima.name}
                                    label="Plástico Acima"
                                    checked={Boolean(formData.plasticoAcima.value)}
                                    onChange={handleCheckboxChange}
                                />
                            </div>
                            <div>
                                <FormCheckbox
                                    id={formData.especial.id}
                                    name={formData.especial.name}
                                    label="Especial"
                                    checked={Boolean(formData.especial.value)}
                                    onChange={handleCheckboxChange}
                                />
                            </div>
                        </div>
                        <div className="form-buttons">
                            <Link to="/fathers">
                                <button type="reset" className="btn btn-white">Cancelar</button>
                            </Link>
                            {fatherId && (
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

            {fatherId && (
                <HistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={() => setIsHistoryModalOpen(false)}
                    entityId={fatherId}
                    fetchHistoryFn={paiService.pesquisarHistorico}
                    entityName={`Pai - ${formData.descricao.value || fatherId}`}
                />
            )}
        </main>
    );
}