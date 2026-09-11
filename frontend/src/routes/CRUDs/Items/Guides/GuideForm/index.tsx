import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import 'flatpickr/dist/themes/material_red.css';
import Flatpickr from "react-flatpickr";
import FormInput from '../../../../../components/FormInput';
import FormLabel from '../../../../../components/FormLabel';
import { useGuideForm } from '../../../../../hooks/crud/useGuideForm';
import { HistoryButton, HistoryModal } from '../../../../../components/history';
import * as roteiroService from '../../../../../services/roteiroService';

export default function GuideForm() {
    const params = useParams();
    const guideId = params.guideId !== 'create' ? Number(params.guideId) : undefined;
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const {
        formData,
        handleInputChange,
        handleTurnDirty,
        handleSubmit,
        dateTimeStart,
        dateTimeEnd,
        handleDateTimeStartChange,
        handleDateTimeEndChange,
    } = useGuideForm();

    return(
        <main>
            <section id="form-section" className="container">
                <div className="form-container">
                    <form className="card form" onSubmit={handleSubmit}>
                        <h2>Roteiro</h2>
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
                                <FormLabel text="Implantação" isRequired/>
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
                                <FormLabel text="Data Final" />
                                <Flatpickr
                                    id="dataFinal"
                                    name="dataFinal"
                                    value={dateTimeEnd}
                                    onChange={(selectedDateTime: Date[]) => handleDateTimeEndChange(selectedDateTime)}
                                    options={{
                                        enableTime: false,
                                        dateFormat: 'Y-m-d',
                                    }}
                                    className="form-control"
                                />
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
                            <Link to="/guides">
                                <button type="reset" className="btn btn-white">Cancelar</button>
                            </Link>
                            {guideId && (
                                <HistoryButton onClick={() => setIsHistoryModalOpen(true)} />
                            )}
                            <button type="submit" className="btn btn-primary">Salvar</button>
                        </div>
                    </form>
                </div>
            </section>

            {guideId && (
                <HistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={() => setIsHistoryModalOpen(false)}
                    entityId={guideId}
                    fetchHistoryFn={roteiroService.pesquisarHistorico}
                    entityName={`Roteiro - ${formData.descricao.value || guideId}`}
                />
            )}
        </main>
    );
}