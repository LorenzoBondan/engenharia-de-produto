import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropdownData } from '../common/useDropdownData';
import * as paiService from '../../services/paiService';
import * as modeloService from '../../services/modeloService';
import * as categoriaComponenteService from '../../services/categoriaComponenteService';
import * as corService from '../../services/corService';
import * as medidasService from '../../services/medidasService';
import * as materialService from '../../services/materialService';
import * as maquinaService from '../../services/maquinaService';
import * as forms from '../../utils/forms';
import { DModelo } from '../../models/modelo';
import { DCor } from '../../models/cor';
import { DMedidas } from '../../models/medidas';
import { DMaterial } from '../../models/material';
import { DMaquina } from '../../models/maquina';
import { DCategoriaComponente } from '../../models/categoriaComponente';
import { DTipoPinturaEnum } from '../../models/enums/tipoPintura';
import { DTipoFilhoEnum } from '../../models/enums/tipoFilho';
import { toast } from 'react-toastify';

/**
 * Custom hook for SingleStruct (Estrutura MDP/MDF) form management
 * Handles complex form with 20+ fields including multi-selects, enums, dates, and checkboxes
 * Uses useDropdownData to load 7 service dependencies in parallel
 */
export function useSingleStruct() {
  const navigate = useNavigate();
  const [dateTimeStart, setDateTimeStart] = useState('');

  // Load all dropdown data in parallel using useDropdownData
  const { data: dropdownData, loading: dropdownLoading, error: dropdownError } = useDropdownData<{
    cores: DCor[];
    medidas: DMedidas[];
    materiais: DMaterial[];
    maquinas: DMaquina[];
    modelos: DModelo[];
    categoriaComponentes: DCategoriaComponente[];
  }>([
    {
      key: 'cores',
      fetchFunction: () => corService.pesquisarTodos('situacao', '=', 'ATIVO'),
      transform: (response: any) => response.content,
    },
    {
      key: 'medidas',
      fetchFunction: () => medidasService.pesquisarTodos('situacao', '=', 'ATIVO'),
      transform: (response: any) => response.content,
    },
    {
      key: 'materiais',
      fetchFunction: () => materialService.pesquisarTodos('situacao', '=', 'ATIVO'),
      transform: (response: any) => response.content,
    },
    {
      key: 'maquinas',
      fetchFunction: () => maquinaService.pesquisarTodos('situacao', '=', 'ATIVO'),
      transform: (response: any) => response.content,
    },
    {
      key: 'modelos',
      fetchFunction: () => modeloService.pesquisarTodos('situacao', '=', 'ATIVO'),
      transform: (response: any) => response.content,
    },
    {
      key: 'categoriaComponentes',
      fetchFunction: () => categoriaComponenteService.pesquisarTodos('situacao', '=', 'ATIVO'),
      transform: (response: any) => response.content,
    },
  ]);

  const [formData, setFormData] = useState<any>({
    modelo: {
      value: null,
      id: 'modelo',
      name: 'modelo',
      placeholder: 'Modelo',
      validation: (value: any) => value !== null,
      message: 'Modelo é obrigatório',
    },
    categoriaComponente: {
      value: null,
      id: 'categoriaComponente',
      name: 'categoriaComponente',
      placeholder: 'Categoria Componente',
      validation: (value: any) => value !== null,
      message: 'Categoria Componente é obrigatória',
    },
    cores: {
      value: [],
      id: 'cores',
      name: 'cores',
      placeholder: 'Cores',
      validation: function (value: DCor[]) {
        return value.length > 0;
      },
      message: 'Escolha ao menos uma cor',
    },
    medidas: {
      value: [],
      id: 'medidas',
      name: 'medidas',
      placeholder: 'Medidas',
      validation: function (value: DMedidas[]) {
        return value.length > 0;
      },
      message: 'Escolha ao menos uma medida',
    },
    materiais: {
      value: [],
      id: 'materiais',
      name: 'materiais',
      placeholder: 'Materiais',
      validation: function (value: DMaterial[]) {
        return value.length > 0;
      },
      message: 'Escolha ao menos um material',
    },
    maquinas: {
      value: [],
      id: 'maquinas',
      name: 'maquinas',
      placeholder: 'Máquinas',
      validation: function (value: DMaquina[]) {
        return value.length > 0;
      },
      message: 'Escolha ao menos um máquina',
    },
    implantacao: {
      value: '',
      id: 'implantacao',
      name: 'implantacao',
      placeholder: 'Implantação',
    },
    tipoFilho: {
      value: null,
      id: 'tipoFilho',
      name: 'tipoFilho',
      placeholder: 'Tipo de Filho',
      validation: (value: any) => value !== null,
      message: 'Tipo de Filho é obrigatório',
    },
    bordasComprimento: {
      value: null,
      id: 'bordasComprimento',
      name: 'bordasComprimento',
      type: 'number',
      placeholder: 'Bordas no Comprimento',
      validation: function (value: any) {
        return Number(value) >= 0;
      },
      message: 'Bordas no Comprimento não pode ser negativa',
    },
    bordasLargura: {
      value: null,
      id: 'bordasLargura',
      name: 'bordasLargura',
      type: 'number',
      placeholder: 'Bordas na Largura',
      validation: function (value: any) {
        return Number(value) >= 0;
      },
      message: 'Bordas na Largura não pode ser negativa',
    },
    numeroCantoneiras: {
      value: null,
      id: 'numeroCantoneiras',
      name: 'numeroCantoneiras',
      type: 'number',
      placeholder: 'Número de Cantoneiras',
      validation: function (value: any) {
        return value === '' || value === null || Number(value) >= 0;
      },
      message: 'Número de Cantoneiras não pode ser negativo',
    },
    tntUmaFace: {
      value: false,
      id: 'tntUmaFace',
      name: 'tntUmaFace',
      type: 'boolean',
      placeholder: 'Tnt uma Face',
      validation: (value: any) => value !== null,
      message: 'Tnt um face é obrigatório',
    },
    plasticoAcima: {
      value: false,
      id: 'plasticoAcima',
      name: 'plasticoAcima',
      type: 'boolean',
      placeholder: 'Plástico Acima',
      validation: (value: any) => value !== null,
      message: 'Plástico acima é obrigatório',
    },
    plasticoAdicional: {
      value: null,
      id: 'plasticoAdicional',
      name: 'plasticoAdicional',
      type: 'number',
      placeholder: 'Plástico Adicional',
      validation: function (value: any) {
        return value === '' || value === null || Number(value) >= 0;
      },
      message: 'Plástico Adicional não pode ser negativo',
    },
    larguraPlastico: {
      value: null,
      id: 'larguraPlastico',
      name: 'larguraPlastico',
      type: 'number',
      placeholder: 'Largura Plástico',
      validation: function (value: any) {
        return value === '' || value === null || Number(value) >= 0;
      },
      message: 'Largura Plástico não pode ser negativo',
    },
    faces: {
      value: null,
      id: 'faces',
      name: 'faces',
      type: 'number',
      placeholder: 'Faces',
      validation: function (value: any) {
        return Number(value) >= 0;
      },
      message: 'Faces não pode ser negativo',
    },
    especial: {
      value: false,
      id: 'especial',
      name: 'especial',
      type: 'boolean',
      placeholder: 'Especial',
    },
    tipoPintura: {
      value: null,
      id: 'tipoPintura',
      name: 'tipoPintura',
      placeholder: 'Tipo de Pintura',
    },
  });

  // Enum options
  const tipoFilhoOptions = Object.values(DTipoFilhoEnum).map((item) => ({
    value: item.name,
    label: item.label,
  }));

  const tipoPinturaOptions = Object.values(DTipoPinturaEnum).map((item) => ({
    value: item.name,
    label: item.label,
  }));

  const handleInputChange = (event: any) => {
    setFormData(forms.updateAndValidate(formData, event.target.name, event.target.value));
  };

  const handleTurnDirty = (name: string) => {
    setFormData(forms.dirtyAndValidate(formData, name));
  };

  const handleDateTimeStartChange = (selectedDateTime: string | Date[]) => {
    if (Array.isArray(selectedDateTime) && selectedDateTime.length > 0) {
      const selectedDate = selectedDateTime[0] as Date;
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDateTimeStart(formattedDate);
    } else {
      setDateTimeStart('');
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value: checked,
      },
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formDataValidated = forms.dirtyAndValidateAll(formData);
    if (forms.hasAnyInvalid(formDataValidated)) {
      setFormData(formDataValidated);
      return;
    }

    const requestBody = forms.toValues(formData);

    // Date format
    requestBody.implantacao = dateTimeStart;

    // Enum format
    if (requestBody.tipoPintura !== null) {
      requestBody.tipoPintura = formData.tipoPintura.value.value;
    }
    requestBody.tipoFilho = formData.tipoFilho.value.value;

    // Nullable fields
    ['bordasComprimento', 'bordasLargura'].forEach((field) => {
      if (requestBody[field] === '') {
        requestBody[field] = null;
      }
    });

    try {
      await paiService.criarEstrutura(requestBody);
      toast.success('Estrutura criada com sucesso!');
      navigate('/fathers');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao criar estrutura');
      const newInputs = forms.setBackendErrors(formData, error.response?.data?.errors || []);
      setFormData(newInputs);
    }
  };

  // Handle dropdown data errors
  useEffect(() => {
    if (dropdownError) {
      toast.error(dropdownError);
    }
  }, [dropdownError]);

  return {
    formData,
    setFormData,
    handleInputChange,
    handleTurnDirty,
    handleSubmit,
    selectCores: dropdownData.cores || [],
    selectMedidas: dropdownData.medidas || [],
    selectMateriais: dropdownData.materiais || [],
    selectMaquinas: dropdownData.maquinas || [],
    selectModelos: dropdownData.modelos || [],
    selectCategoriaComponentes: dropdownData.categoriaComponentes || [],
    tipoFilhoOptions,
    tipoPinturaOptions,
    dateTimeStart,
    handleDateTimeStartChange,
    handleCheckboxChange,
    loading: dropdownLoading,
  };
}
