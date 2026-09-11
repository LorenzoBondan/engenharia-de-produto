import * as forms from '../../../../utils/forms';
import FormLabel from '../../../../components/FormLabel';
import FormInput from '../../../../components/FormInput';
import FormSelect from '../../../../components/FormSelect';
import FormCheckbox from '../../../../components/FormCheckBox';
import 'flatpickr/dist/themes/material_red.css';
import Flatpickr from "react-flatpickr";
const DatePicker = Flatpickr as any;
import { Link } from 'react-router-dom';
import { useSingleStruct } from '../../../../hooks/operator/useSingleStruct';
import './styles.css';

export default function SingleStruct() {

    const {
        formData,
        setFormData,
        handleInputChange,
        handleTurnDirty,
        handleSubmit,
        selectCores,
        selectMedidas,
        selectMateriais,
        selectMaquinas,
        selectModelos,
        selectCategoriaComponentes,
        tipoFilhoOptions,
        tipoPinturaOptions,
        dateTimeStart,
        handleDateTimeStartChange,
        handleCheckboxChange,
    } = useSingleStruct();

    return(
        <main>
            <section id="form-section" className="container">
                <div className="form-container">
                    <form className="card form" onSubmit={handleSubmit}>
                        <h2>Estrutura MDP/MDF</h2>
                        <div className="form-controls-container">
                            <div>
                                <FormLabel text="Modelo" isRequired/>
                                <FormSelect
                                    {...formData.modelo}
                                    className="form-control form-select-container"
                                    options={selectModelos}
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
                                    options={selectCategoriaComponentes}
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
                                <FormLabel text="Cores" isRequired/>
                                <FormSelect
                                    {...formData.cores}
                                    className="form-control form-select-container"
                                    options={selectCores}
                                    onChange={(obj: any) => {
                                        const newFormData = forms.updateAndValidate(formData, "cores", obj);
                                        console.log(newFormData.cores);
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                    isMulti
                                    getOptionLabel={(obj: any) => obj.descricao}
                                    getOptionValue={(obj: any) => String(obj.codigo)}
                                />
                                <div className="form-error">{formData.cores.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Medidas" isRequired/>
                                <FormSelect
                                    {...formData.medidas}
                                    className="form-control form-select-container"
                                    options={selectMedidas}
                                    onChange={(obj: any) => {
                                        const newFormData = forms.updateAndValidate(formData, "medidas", obj);
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                    isMulti
                                    getOptionLabel={(obj: any) => `${obj.altura}X${obj.largura}X${obj.espessura}` }
                                    getOptionValue={(obj: any) => String(obj.codigo)}
                                />
                                <div className="form-error">{formData.medidas.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Materiais" isRequired/>
                                <FormSelect
                                    {...formData.materiais}
                                    className="form-control form-select-container"
                                    options={selectMateriais}
                                    onChange={(obj: any) => {
                                        const newFormData = forms.updateAndValidate(formData, "materiais", obj);
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                    isMulti
                                    getOptionLabel={(obj: any) => obj.descricao}
                                    getOptionValue={(obj: any) => String(obj.codigo)}
                                />
                                <div className="form-error">{formData.materiais.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Máquinas" isRequired/>
                                <FormSelect
                                    {...formData.maquinas}
                                    className="form-control form-select-container"
                                    options={selectMaquinas}
                                    onChange={(obj: any) => {
                                        const newFormData = forms.updateAndValidate(formData, "maquinas", obj);
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                    isMulti
                                    getOptionLabel={(obj: any) => obj.descricao}
                                    getOptionValue={(obj: any) => String(obj.codigo)}
                                />
                                <div className="form-error">{formData.maquinas.message}</div>
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
                                <FormLabel text="Número Cantoneiras" isRequired/>
                                <FormInput
                                    {...formData.numeroCantoneiras}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.numeroCantoneiras.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Plástico Adicional" isRequired/>
                                <FormInput
                                    {...formData.plasticoAdicional}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.plasticoAdicional.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Largura Plastico" isRequired/>
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
                                <FormLabel text="Tipo de Filho" isRequired />    
                                <FormSelect
                                    {...formData.tipoFilho}
                                    className="form-control form-select-container"
                                    options={tipoFilhoOptions}
                                    value={formData.tipoFilho.value}
                                    onChange={(selectedOption: any) => {
                                        const newFormData = forms.updateAndValidate(
                                            formData,
                                            "tipoFilho",
                                            selectedOption
                                        );
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                />
                                <div className="form-error">{formData.tipoFilho.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Tipo de Pintura" />    
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
                                <FormLabel text="Implantação" />
                                <DatePicker
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
                                <FormCheckbox
                                    id={formData.plasticoAcima.id}
                                    name={formData.plasticoAcima.name}
                                    label="Plástico Acima"
                                    checked={formData.plasticoAcima.value}
                                    onChange={handleCheckboxChange}
                                />
                            </div>
                            <div>
                                <FormCheckbox
                                    id={formData.especial.id}
                                    name={formData.especial.name}
                                    label="Especial"
                                    checked={formData.especial.value}
                                    onChange={handleCheckboxChange}
                                />
                            </div>
                            <div>
                                <FormCheckbox
                                    id={formData.tntUmaFace.id}
                                    name={formData.tntUmaFace.name}
                                    label="Tnt uma Face"
                                    checked={formData.tntUmaFace.value}
                                    onChange={handleCheckboxChange}
                                />
                            </div>
                        </div>
                        <div className="form-buttons">
                            <Link to="/fathers">
                                <button type="reset" className="btn btn-white">Cancelar</button>
                            </Link>
                            <button type="submit" className="btn btn-primary">Salvar</button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}