import * as forms from '../../../../utils/forms';
import FormLabel from '../../../../components/FormLabel';
import FormInput from '../../../../components/FormInput';
import FormSelect from '../../../../components/FormSelect';
import FormCheckbox from '../../../../components/FormCheckBox';
import 'flatpickr/dist/themes/material_red.css';
import Flatpickr from "react-flatpickr";
const DatePicker = Flatpickr as any;
import { Link } from 'react-router-dom';
import { useMultiStruct } from '../../../../hooks/operator/useMultiStruct';
import './styles.css';

export default function MultiStruct() {

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
        selectAcessorios,
        dateTimeStart,
        handleDateTimeStartChange,
        handleCheckboxChange,
        handleAddPaiSecundario,
        handleRemovePaiSecundario,
        handlePaiSecundarioChange,
        handlePaiSecundarioMedidasChange,
        handlePaiSecundarioMaquinasChange,
        handleAddAcessorio,
        handleRemoveAcessorio,
        handleAcessorioChange,
    } = useMultiStruct();

    return(
        <main>
            <section id="form-section" className="container">
                <div className="form-container">
                    <form className="card form" onSubmit={handleSubmit}>
                        <h2>Estrutura Modulação/Alumínios</h2>
                        <div className="form-controls-container">
                            <h3>Pai Principal</h3>
                            <div>
                                <FormLabel text="Modelo" isRequired/>
                                <FormSelect
                                    {...formData.modeloPaiPrincipal}
                                    className="form-control form-select-container"
                                    options={selectModelos}
                                    value={formData.modeloPaiPrincipal.value}
                                    onChange={(selectedOption: any) => {
                                        const newFormData = forms.updateAndValidate(
                                            formData,
                                            "modeloPaiPrincipal",
                                            selectedOption
                                        );
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                    getOptionLabel={(obj: any) => obj.descricao}
                                    getOptionValue={(obj: any) => String(obj.codigo)}
                                />
                                <div className="form-error">{formData.modeloPaiPrincipal.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Categoria Componente" isRequired/>
                                <FormSelect
                                    {...formData.categoriaComponentePaiPrincipal}
                                    className="form-control form-select-container"
                                    options={selectCategoriaComponentes}
                                    value={formData.categoriaComponentePaiPrincipal.value}
                                    onChange={(selectedOption: any) => {
                                        const newFormData = forms.updateAndValidate(
                                            formData,
                                            "categoriaComponentePaiPrincipal",
                                            selectedOption
                                        );
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                    getOptionLabel={(obj: any) => obj.descricao}
                                    getOptionValue={(obj: any) => String(obj.codigo)}
                                />
                                <div className="form-error">{formData.categoriaComponentePaiPrincipal.message}</div>
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
                                    {...formData.medidasPaiPrincipal}
                                    className="form-control form-select-container"
                                    options={selectMedidas}
                                    value={formData.medidasPaiPrincipal.value}
                                    onChange={(selectedOption: any) => {
                                        const newFormData = forms.updateAndValidate(
                                            formData,
                                            "medidasPaiPrincipal",
                                            selectedOption
                                        );
                                        setFormData(newFormData);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                    getOptionLabel={(obj: any) => `${obj.altura}X${obj.largura}X${obj.espessura}`}
                                    getOptionValue={(obj: any) => String(obj.codigo)}
                                />
                                <div className="form-error">{formData.medidasPaiPrincipal.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Materiais"/>
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
                                    {...formData.bordasComprimentoPaiPrincipal}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.bordasComprimentoPaiPrincipal.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Bordas Largura" />
                                <FormInput
                                    {...formData.bordasLarguraPaiPrincipal}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.bordasLarguraPaiPrincipal.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Número Cantoneiras" isRequired/>
                                <FormInput
                                    {...formData.numeroCantoneirasPaiPrincipal}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.numeroCantoneirasPaiPrincipal.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Plástico Adicional" isRequired/>
                                <FormInput
                                    {...formData.plasticoAdicionalPaiPrincipal}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.plasticoAdicionalPaiPrincipal.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Largura Plastico" isRequired/>
                                <FormInput
                                    {...formData.larguraPlasticoPaiPrincipal}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.larguraPlasticoPaiPrincipal.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Faces" />
                                <FormInput
                                    {...formData.facesPaiPrincipal}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.facesPaiPrincipal.message}</div>
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
                                    id={formData.plasticoAcimaPaiPrincipal.id}
                                    name={formData.plasticoAcimaPaiPrincipal.name}
                                    label="Plástico Acima"
                                    checked={formData.plasticoAcimaPaiPrincipal.value}
                                    onChange={handleCheckboxChange}
                                />
                            </div>
                            <div>
                                <FormCheckbox
                                    id={formData.tntUmaFacePaiPrincipal.id}
                                    name={formData.tntUmaFacePaiPrincipal.name}
                                    label="Tnt uma Face"
                                    checked={formData.tntUmaFacePaiPrincipal.value}
                                    onChange={handleCheckboxChange}
                                />
                            </div>
                        </div>
                        <div className="form-controls-container">
                            <h3>Pais Secundários</h3>
                            <button type="button" className="btn btn-primary" onClick={handleAddPaiSecundario}>
                                Adicionar Pai Secundário
                            </button>
                            {formData.paisSecundarios.map((pai: any, index: number) => (
                                <div key={pai.id} className="pai-secundario-container">
                                    <h4>Pai Secundário {index + 1}</h4>
                                    <div>
                                    <FormLabel text="Modelo" />
                                    <FormSelect
                                        placeholder="Modelo"
                                        className="form-control form-select-container"
                                        options={selectModelos}
                                        value={pai.pai.modelo}
                                        onChange={(selectedOption: any) => handlePaiSecundarioChange(pai.id, 'modelo', selectedOption)}
                                        getOptionLabel={(obj: any) => obj.descricao}
                                        getOptionValue={(obj: any) => String(obj.codigo)}
                                    />
                                    </div>
                                    <div>
                                    <FormLabel text="Categoria Componente" />
                                    <FormSelect
                                        placeholder="Categoria Componente"
                                        options={selectCategoriaComponentes}
                                        className="form-control form-select-container"
                                        value={pai.pai.categoriaComponente}
                                        onChange={(selectedOption: any) => handlePaiSecundarioChange(pai.id, 'categoriaComponente', selectedOption)}
                                        getOptionLabel={(obj: any) => obj.descricao}
                                        getOptionValue={(obj: any) => String(obj.codigo)}
                                    />
                                    </div>
                                    <FormLabel text="Medidas" />
                                    <FormSelect
                                        placeholder="Medidas"
                                        options={selectMedidas}
                                        className="form-control form-select-container"
                                        value={pai.medidas}
                                        onChange={(selectedOption: any) => handlePaiSecundarioMedidasChange(pai.id, selectedOption)}
                                        getOptionLabel={(obj: any) => `${obj.altura}X${obj.largura}X${obj.espessura}`}
                                        getOptionValue={(obj: any) => String(obj.codigo)}
                                    />
                                    <FormLabel text="Bordas Comprimento" />
                                    <FormInput
                                        className="form-control"
                                        value={pai.pai.bordasComprimento}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            handlePaiSecundarioChange(pai.id, 'bordasComprimento', Number(e.target.value))
                                        }
                                    />
                                    <FormLabel text="Bordas Largura" />
                                    <FormInput
                                        className="form-control"
                                        value={pai.pai.bordasLargura}
                                        onChange={(e: any) => handlePaiSecundarioChange(pai.id, 'bordasLargura', Number(e.target.value))}
                                    />
                                    <FormLabel text="Número Cantoneiras" />
                                    <FormInput
                                        className="form-control"
                                        value={pai.pai.numeroCantoneiras}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            handlePaiSecundarioChange(pai.id, 'numeroCantoneiras', e.target.value)
                                        }
                                    />
                                    <FormCheckbox
                                        id={pai.id}
                                        name={pai.name}
                                        label="Tnt uma Face"
                                        checked={pai.pai.tntUmaFace}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            handlePaiSecundarioChange(pai.id, 'tntUmaFace', e.target.checked)
                                        }
                                    />
                                    <FormCheckbox
                                        id={pai.id}
                                        name={pai.name}
                                        label="Plástico Acima"
                                        checked={pai.pai.plasticoAcima}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            handlePaiSecundarioChange(pai.id, 'plasticoAcima', e.target.checked)
                                        }
                                    />
                                    <FormLabel text="Plástico Adicional" />
                                    <FormInput
                                        className="form-control"
                                        value={pai.pai.plasticoAdicional}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            handlePaiSecundarioChange(pai.id, 'plasticoAdicional', e.target.value)
                                        }
                                    />
                                    <FormLabel text="Largura Plástico" />
                                    <FormInput
                                        className="form-control"
                                        value={pai.pai.larguraPlastico}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            handlePaiSecundarioChange(pai.id, 'larguraPlastico', e.target.value)
                                        }
                                    />
                                    <FormLabel text="Faces" />
                                    <FormInput
                                        className="form-control"
                                        value={pai.pai.faces}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            handlePaiSecundarioChange(pai.id, 'faces', e.target.value)
                                        }
                                    />
                                    <FormLabel text="Máquinas" />
                                    <FormSelect
                                        placeholder="Máquinas"
                                        className="form-control form-select-container"
                                        options={selectMaquinas}
                                        value={pai.maquinas}
                                        onChange={(selectedOption: any) => handlePaiSecundarioMaquinasChange(pai.id, selectedOption)}
                                        isMulti
                                        getOptionLabel={(obj: any) => obj.nome}
                                        getOptionValue={(obj: any) => String(obj.codigo)}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-inverse"
                                        onClick={() => handleRemovePaiSecundario(pai.id)}
                                    >
                                        Remover Pai Secundário
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="form-controls-container">
                            <h3>Acessórios</h3>
                            <button type="button" className="btn btn-primary" onClick={handleAddAcessorio}>
                                Adicionar Acessório
                            </button>
                            {formData.acessoriosQuantidades.map((acc: any, index: number) => (
                                <div key={acc.id} className="pai-secundario-container">
                                    <h4>Acessório {index + 1}</h4>
                                    <FormSelect
                                        placeholder="Acessório"
                                        className="form-control form-select-container"
                                        options={selectAcessorios}
                                        value={acc.acessorio}
                                        onChange={(selectedOption: any) => handleAcessorioChange(acc.id, 'acessorio', selectedOption)}
                                        getOptionLabel={(obj: any) => obj.descricao}
                                        getOptionValue={(obj: any) => String(obj.codigo)}
                                    />
                                    <FormLabel text="Quantidade" />
                                    <FormInput
                                        className="form-control"
                                        value={acc.quantidade}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            handleAcessorioChange(acc.id, 'quantidade', Number(e.target.value))
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-inverse"
                                        onClick={() => handleRemoveAcessorio(acc.id)}
                                    >
                                        Remover Acessório
                                    </button>
                                </div>
                            ))}
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