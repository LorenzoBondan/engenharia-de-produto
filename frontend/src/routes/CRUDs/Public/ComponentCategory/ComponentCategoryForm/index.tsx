import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import 'flatpickr/dist/themes/material_red.css';
import FormInput from '../../../../../components/FormInput';
import FormLabel from '../../../../../components/FormLabel';
import { useComponentCategoryForm } from '../../../../../hooks/crud/useComponentCategoryForm';
import { LoadingButton } from '../../../../../components/Loading';
import { HistoryButton, HistoryModal } from '../../../../../components/history';
import * as categoriaComponenteService from '../../../../../services/categoriaComponenteService';

export default function ComponentCategoryForm() {
    const params = useParams();
    const componentCategoryId = params.componentCategoryId !== 'create' ? Number(params.componentCategoryId) : undefined;
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const { formData, loading, handleInputChange, handleTurnDirty, handleSubmit } = useComponentCategoryForm(); 
    
    return(
        <main>
            <section id="form-section" className="container">
                <div className="form-container">
                    <form className="card form" onSubmit={handleSubmit}>
                        <h2>Categoria Componente</h2>
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
                        </div>
                        <div className="form-buttons">
                            <Link to="/componentcategories">
                                <button type="reset" className="btn btn-white">Cancelar</button>
                            </Link>
                            {componentCategoryId && (
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

            {componentCategoryId && (
                <HistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={() => setIsHistoryModalOpen(false)}
                    entityId={componentCategoryId}
                    fetchHistoryFn={categoriaComponenteService.pesquisarHistorico}
                    entityName={`Categoria Componente - ${formData.descricao.value || componentCategoryId}`}
                />
            )}
        </main>
    );
}