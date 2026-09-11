import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import * as forms from '../../../../../utils/forms';
import FormLabel from '../../../../../components/FormLabel';
import FormInput from '../../../../../components/FormInput';
import FormSelect from '../../../../../components/FormSelect';
import { useUsedMaterialForm } from '../../../../../hooks/crud/useUsedMaterialForm';
import { HistoryButton, HistoryModal } from '../../../../../components/history';
import * as materialUsadoService from '../../../../../services/materialUsadoService';

export default function UsedMaterialForm() {
    const params = useParams();
    const usedMaterialId = params.usedMaterialId !== 'create' ? Number(params.usedMaterialId) : undefined;
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const {
        formData,
        setFormData,
        handleInputChange,
        handleTurnDirty,
        handleSubmit,
        materiais,
        filhos,
        previousPath,
    } = useUsedMaterialForm();
    
    return(
        <main>
            <section id="form-section" className="container">
                <div className="form-container">
                    <form className="card form" onSubmit={handleSubmit}>
                        <h2>Material Usado</h2>
                        <div className="form-controls-container">
                            <div>
                                <FormLabel text="Material" isRequired />
                                <FormSelect
                                    {...formData.material}
                                    className="form-control form-select-container"
                                    options={materiais}
                                    value={formData.material.value}
                                    onChange={(selectedOption: any) => {
                                        const newFormData = forms.updateAndValidate(
                                            formData,
                                            "material",
                                            selectedOption
                                        );
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                    getOptionLabel={(obj: any) => obj.descricao}
                                    getOptionValue={(obj: any) => String(obj.codigo)}
                                />
                                <div className="form-error">{formData.material.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Filho" isRequired />
                                <FormSelect
                                    {...formData.filho}
                                    className="form-control form-select-container"
                                    options={filhos}
                                    value={formData.filho.value}
                                    onChange={(selectedOption: any) => {
                                        const newFormData = forms.updateAndValidate(
                                            formData,
                                            "filho",
                                            selectedOption
                                        );
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                    getOptionLabel={(obj: any) => obj.descricao}
                                    getOptionValue={(obj: any) => String(obj.codigo)}
                                />
                                <div className="form-error">{formData.filho.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Quantidade Líquida" isRequired />
                                <FormInput
                                    {...formData.quantidadeLiquida}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.quantidadeLiquida.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Quantidade Bruta" isRequired />
                                <FormInput
                                    {...formData.quantidadeBruta}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.quantidadeBruta.message}</div>
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
                        </div>
                        <div className="form-buttons">
                            <Link to={previousPath}>
                                <button type="reset" className="btn btn-white">Cancelar</button>
                            </Link>
                            {usedMaterialId && (
                                <HistoryButton onClick={() => setIsHistoryModalOpen(true)} />
                            )}
                            <button type="submit" className="btn btn-primary">Salvar</button>
                        </div>
                    </form>
                </div>
            </section>

            {usedMaterialId && (
                <HistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={() => setIsHistoryModalOpen(false)}
                    entityId={usedMaterialId}
                    fetchHistoryFn={materialUsadoService.pesquisarHistorico}
                    entityName={`Material Usado - ${formData.material.value?.descricao || usedMaterialId}`}
                />
            )}
        </main>
    );
}