import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import * as forms from '../../../../../utils/forms';
import FormLabel from '../../../../../components/FormLabel';
import FormInput from '../../../../../components/FormInput';
import FormSelect from '../../../../../components/FormSelect';
import { useUsedAccessoryForm } from '../../../../../hooks/crud/useUsedAccessoryForm';
import { HistoryButton, HistoryModal } from '../../../../../components/history';
import * as acessorioUsadoService from '../../../../../services/acessorioUsadoService';

export default function UsedAccessoryForm() {
    const params = useParams();
    const usedAccessoryId = params.usedAccessoryId !== 'create' ? Number(params.usedAccessoryId) : undefined;
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const {
        formData,
        setFormData,
        handleInputChange,
        handleTurnDirty,
        handleSubmit,
        acessorios,
        filhos,
        previousPath,
    } = useUsedAccessoryForm();
    
    return(
        <main>
            <section id="form-section" className="container">
                <div className="form-container">
                    <form className="card form" onSubmit={handleSubmit}>
                        <h2>Acessório Usado</h2>
                        <div className="form-controls-container">
                            <div>
                                <FormLabel text="Acessório" isRequired />
                                <FormSelect
                                    {...formData.acessorio}
                                    className="form-control form-select-container"
                                    options={acessorios}
                                    value={formData.acessorio.value}
                                    onChange={(selectedOption: any) => {
                                        const newFormData = forms.updateAndValidate(
                                            formData,
                                            "acessorio",
                                            selectedOption
                                        );
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                    getOptionLabel={(obj: any) => obj.descricao}
                                    getOptionValue={(obj: any) => String(obj.codigo)}
                                />
                                <div className="form-error">{formData.acessorio.message}</div>
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
                                <FormLabel text="Quantidade" isRequired />
                                <FormInput
                                    {...formData.quantidade}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.quantidade.message}</div>
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
                            {usedAccessoryId && (
                                <HistoryButton onClick={() => setIsHistoryModalOpen(true)} />
                            )}
                            <button type="submit" className="btn btn-primary">Salvar</button>
                        </div>
                    </form>
                </div>
            </section>

            {usedAccessoryId && (
                <HistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={() => setIsHistoryModalOpen(false)}
                    entityId={usedAccessoryId}
                    fetchHistoryFn={acessorioUsadoService.pesquisarHistorico}
                    entityName={`Acessório Usado - ${formData.acessorio.value?.descricao || usedAccessoryId}`}
                />
            )}
        </main>
    );
}