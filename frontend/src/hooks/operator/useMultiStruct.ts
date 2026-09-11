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
import * as acessorioService from '../../services/acessorioService';
import * as forms from '../../utils/forms';
import { DModelo } from '../../models/modelo';
import { DCor } from '../../models/cor';
import { DMedidas } from '../../models/medidas';
import { DMaterial } from '../../models/material';
import { DMaquina } from '../../models/maquina';
import { DCategoriaComponente } from '../../models/categoriaComponente';
import { DAcessorio } from '../../models/acessorio';
import { toast } from 'react-toastify';

/**
 * Custom hook for MultiStruct (Estrutura Modulação) form management
 * Handles even more complex form with pai principal, paisSecundarios array, acessoriosQuantidades array
 * Uses useDropdownData to load 8 service dependencies in parallel (SingleStruct + acessorioService)
 */
export function useMultiStruct() {
  const navigate = useNavigate();
  const [dateTimeStart, setDateTimeStart] = useState('');

  // Load all dropdown data in parallel using useDropdownData (8 services)
  const { data: dropdownData, loading: dropdownLoading, error: dropdownError } = useDropdownData<{
    cores: DCor[];
    medidas: DMedidas[];
    materiais: DMaterial[];
    maquinas: DMaquina[];
    modelos: DModelo[];
    categoriaComponentes: DCategoriaComponente[];
    acessorios: DAcessorio[];
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
    {
      key: 'acessorios',
      fetchFunction: () => acessorioService.pesquisarTodos('situacao', '=', 'ATIVO'),
      transform: (response: any) => response.content,
    },
  ]);

  const [formData, setFormData] = useState<any>({
    modeloPaiPrincipal: {
      value: null,
      id: 'modeloPaiPrincipal',
      name: 'modeloPaiPrincipal',
      placeholder: 'Modelo',
      validation: (value: any) => value !== null,
      message: 'Modelo é obrigatório',
    },
    categoriaComponentePaiPrincipal: {
      value: null,
      id: 'categoriaComponentePaiPrincipal',
      name: 'categoriaComponentePaiPrincipal',
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
    medidasPaiPrincipal: {
      value: null,
      id: 'medidasPaiPrincipal',
      name: 'medidasPaiPrincipal',
      placeholder: 'Medidas',
      validation: function (value: DMedidas) {
        return value !== null;
      },
      message: 'Medidas são obrigatórias',
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
    bordasComprimentoPaiPrincipal: {
      value: null,
      id: 'bordasComprimentoPaiPrincipal',
      name: 'bordasComprimentoPaiPrincipal',
      type: 'number',
      placeholder: 'Bordas no Comprimento',
      validation: function (value: any) {
        return Number(value) >= 0;
      },
      message: 'Bordas no Comprimento não pode ser negativa',
    },
    bordasLarguraPaiPrincipal: {
      value: null,
      id: 'bordasLarguraPaiPrincipal',
      name: 'bordasLarguraPaiPrincipal',
      type: 'number',
      placeholder: 'Bordas na Largura',
      validation: function (value: any) {
        return Number(value) >= 0;
      },
      message: 'Bordas na Largura não pode ser negativa',
    },
    numeroCantoneirasPaiPrincipal: {
      value: null,
      id: 'numeroCantoneirasPaiPrincipal',
      name: 'numeroCantoneirasPaiPrincipal',
      type: 'number',
      placeholder: 'Número de Cantoneiras',
      validation: function (value: any) {
        return value === '' || value === null || Number(value) >= 0;
      },
      message: 'Número de Cantoneiras não pode ser negativo',
    },
    tntUmaFacePaiPrincipal: {
      value: false,
      id: 'tntUmaFacePaiPrincipal',
      name: 'tntUmaFacePaiPrincipal',
      type: 'boolean',
      placeholder: 'Tnt uma Face',
      validation: (value: any) => value !== null,
      message: 'Tnt um face é obrigatório',
    },
    plasticoAcimaPaiPrincipal: {
      value: false,
      id: 'plasticoAcimaPaiPrincipal',
      name: 'plasticoAcimaPaiPrincipal',
      type: 'boolean',
      placeholder: 'Plástico Acima',
      validation: (value: any) => value !== null,
      message: 'Plástico acima é obrigatório',
    },
    plasticoAdicionalPaiPrincipal: {
      value: null,
      id: 'plasticoAdicionalPaiPrincipal',
      name: 'plasticoAdicionalPaiPrincipal',
      type: 'number',
      placeholder: 'Plástico Adicional',
      validation: function (value: any) {
        return value === '' || value === null || Number(value) >= 0;
      },
      message: 'Plástico Adicional não pode ser negativo',
    },
    larguraPlasticoPaiPrincipal: {
      value: null,
      id: 'larguraPlasticoPaiPrincipal',
      name: 'larguraPlasticoPaiPrincipal',
      type: 'number',
      placeholder: 'Largura Plástico',
      validation: function (value: any) {
        return value === '' || value === null || Number(value) >= 0;
      },
      message: 'Largura Plástico não pode ser negativo',
    },
    facesPaiPrincipal: {
      value: null,
      id: 'facesPaiPrincipal',
      name: 'facesPaiPrincipal',
      type: 'number',
      placeholder: 'Faces',
      validation: function (value: any) {
        return Number(value) >= 0;
      },
      message: 'Faces não pode ser negativo',
    },
    paisSecundarios: [],
    acessoriosQuantidades: [],
  });

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

  const handleAddPaiSecundario = () => {
    const novoPaiSecundario = {
      id: Date.now(),
      pai: {
        modelo: null,
        categoriaComponente: null,
        bordasComprimento: '',
        bordasLargura: '',
        numeroCantoneiras: '',
        plasticoAdicional: '',
        larguraPlastico: '',
        faces: '',
        plasticoAcima: false,
        tntUmaFace: false,
      },
      medidas: null,
      maquinas: [],
    };

    setFormData((prevState: any) => ({
      ...prevState,
      paisSecundarios: [...prevState.paisSecundarios, novoPaiSecundario],
    }));
  };

  const handleRemovePaiSecundario = (id: number) => {
    setFormData((prevState: any) => ({
      ...prevState,
      paisSecundarios: prevState.paisSecundarios.filter((p: any) => p.id !== id),
    }));
  };

  const handlePaiSecundarioChange = (id: number, field: string, value: any) => {
    setFormData((prevState: any) => ({
      ...prevState,
      paisSecundarios: prevState.paisSecundarios.map((p: any) =>
        p.id === id
          ? {
              ...p,
              pai: {
                ...p.pai,
                [field]: value,
              },
            }
          : p
      ),
    }));
  };

  const handlePaiSecundarioMedidasChange = (id: number, value: any) => {
    setFormData((prevState: any) => ({
      ...prevState,
      paisSecundarios: prevState.paisSecundarios.map((p: any) => (p.id === id ? { ...p, medidas: value } : p)),
    }));
  };

  const handlePaiSecundarioMaquinasChange = (id: number, value: any) => {
    setFormData((prevState: any) => ({
      ...prevState,
      paisSecundarios: prevState.paisSecundarios.map((p: any) => (p.id === id ? { ...p, maquinas: value } : p)),
    }));
  };

  const handleAddAcessorio = () => {
    const novoAcessorio = {
      id: Date.now(),
      acessorio: null,
      quantidade: '',
    };

    setFormData((prevState: any) => ({
      ...prevState,
      acessoriosQuantidades: [...prevState.acessoriosQuantidades, novoAcessorio],
    }));
  };

  const handleRemoveAcessorio = (id: number) => {
    setFormData((prevState: any) => ({
      ...prevState,
      acessoriosQuantidades: prevState.acessoriosQuantidades.filter((a: any) => a.id !== id),
    }));
  };

  const handleAcessorioChange = (id: number, field: string, value: any) => {
    setFormData((prevState: any) => ({
      ...prevState,
      acessoriosQuantidades: prevState.acessoriosQuantidades.map((a: any) =>
        a.id === id ? { ...a, [field]: value } : a
      ),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const requestBody: any = {
      paiPrincipal: {
        codigo: 0,
        descricao: '',
        modelo: formData.modeloPaiPrincipal.value,
        categoriaComponente: formData.categoriaComponentePaiPrincipal.value,
        bordasComprimento: formData.bordasComprimentoPaiPrincipal.value,
        bordasLargura: formData.bordasLarguraPaiPrincipal.value,
        numeroCantoneiras: formData.numeroCantoneirasPaiPrincipal.value,
        tntUmaFace: formData.tntUmaFacePaiPrincipal.value,
        plasticoAcima: formData.plasticoAcimaPaiPrincipal.value,
        plasticoAdicional: formData.plasticoAdicionalPaiPrincipal.value,
        larguraPlastico: formData.larguraPlasticoPaiPrincipal.value,
        faces: formData.facesPaiPrincipal.value,
        especial: false,
        tipoPintura: 'ACETINADA',
        situacao: 'ATIVO',
        filhos: [],
      },
      medidasPaiPrincipal: formData.medidasPaiPrincipal.value,
      paisSecundarios: formData.paisSecundarios.map((obj: any) => ({
        pai: {
          modelo: obj.pai.modelo,
          categoriaComponente: obj.pai.categoriaComponente,
          bordasComprimento: obj.pai.bordasComprimento,
          bordasLargura: obj.pai.bordasLargura,
          numeroCantoneiras: obj.pai.numeroCantoneiras,
          tntUmaFace: obj.pai.tntUmaFace,
          plasticoAcima: obj.pai.plasticoAcima,
          plasticoAdicional: obj.pai.plasticoAdicional,
          larguraPlastico: obj.pai.larguraPlastico,
          faces: obj.pai.faces,
        },
        medidas: obj.medidas,
        maquinas: obj.maquinas.map((m: any) => ({ codigo: m.codigo })),
      })),
      cores: formData.cores.value.map((cor: any) => ({ codigo: cor.codigo })),
      materiais: formData.materiais.value.map((mat: any) => ({ codigo: mat.codigo })),
      implantacao: dateTimeStart,
      acessoriosQuantidades: formData.acessoriosQuantidades.map((acc: any) => ({
        acessorio: { codigo: acc.acessorio.codigo },
        quantidade: acc.quantidade,
      })),
    };

    try {
      await paiService.criarEstruturaModulacao(requestBody);
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
    selectAcessorios: dropdownData.acessorios || [],
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
    loading: dropdownLoading,
  };
}
