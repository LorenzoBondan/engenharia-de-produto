package br.com.todeschini.domain.business.publico.pai;

import br.com.todeschini.domain.ConversaoValores;
import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.pai.api.PaiService;
import br.com.todeschini.domain.business.publico.pai.builders.EstruturaPaiProcessor;
import br.com.todeschini.domain.business.publico.pai.builders.EstruturaModulacaoBuilder;
import br.com.todeschini.domain.business.publico.pai.montadores.DMontadorEstruturaPai;
import br.com.todeschini.domain.business.publico.pai.montadores.DMontadorEstruturaPaiModulacao;
import br.com.todeschini.domain.business.publico.pai.spi.CrudPai;
import br.com.todeschini.domain.exceptions.BadRequestException;
import br.com.todeschini.domain.exceptions.RegistroDuplicadoException;
import br.com.todeschini.domain.metadata.BatchEditable;
import br.com.todeschini.domain.metadata.DomainService;
import br.com.todeschini.domain.metadata.Entidade;

import java.lang.reflect.Field;
import java.util.*;

@DomainService
public class PaiServiceImpl implements PaiService {

    private final CrudPai crudPai;
    private final ConversaoValores conversaoValores;
    private final EstruturaPaiProcessor estruturaPaiProcessor;
    private final EstruturaModulacaoBuilder estruturaModulacaoBuilder;

    public PaiServiceImpl(
            CrudPai crudPai,
            ConversaoValores conversaoValores,
            EstruturaPaiProcessor estruturaPaiProcessor,
            EstruturaModulacaoBuilder estruturaModulacaoBuilder) {
        this.crudPai = crudPai;
        this.conversaoValores = conversaoValores;
        this.estruturaPaiProcessor = estruturaPaiProcessor;
        this.estruturaModulacaoBuilder = estruturaModulacaoBuilder;
    }

    @Override
    public Paged<DPai> buscar(PageableRequest request) {
        return crudPai.buscarTodos(request);
    }

    @Override
    public List<DPai> buscarPorModelo(Integer cdmodelo) {
        return crudPai.buscarPorModelo(cdmodelo);
    }

    @Override
    public List<DPai> buscarPorCategoriaComponente(Integer cdcategoriaComponente) {
        return crudPai.buscarPorCategoriaComponente(cdcategoriaComponente);
    }

    @Override
    public DPai buscar(Integer id) {
        return crudPai.buscar(id);
    }

    @Override
    public List<DHistory<DPai>> buscarHistorico(Integer id) {
        return crudPai.buscarHistorico(id);
    }

    @Override
    public List<String> buscarAtributosEditaveisEmLote() {
        return crudPai.buscarAtributosEditaveisEmLote();
    }

    @Override
    public DPai incluir(DPai domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudPai.inserir(domain);
    }

    @Override
    public DPai atualizar(DPai domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudPai.atualizar(domain);
    }

    @Override
    public List<DPai> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores) {
        if (atributos.size() != valores.size()) {
            throw new BadRequestException("O número de atributos e valores deve ser igual.");
        }

        List<DPai> lista = codigos.stream()
                .map(this::buscar)
                .toList();

        for (DPai obj : lista) {
            for (int i = 0; i < atributos.size(); i++) {
                String nomeAtributo = atributos.get(i);
                Object valorAtributo = valores.get(i);

                Field field;
                try {
                    field = conversaoValores.buscarCampoNaHierarquia(DPai.class, nomeAtributo);
                    field.setAccessible(true);

                    if (field.isAnnotationPresent(BatchEditable.class)) {
                        Object valorConvertido = conversaoValores.convertValor(field.getType(), valorAtributo); // converte o Object para seu tipo de dado específico

                        // verificar se o tipo do valor convertido é uma entidade mapeada
                        if (valorConvertido != null && valorConvertido.getClass().isAnnotationPresent(Entidade.class)) {
                            // invocar o adaptador com base na entidade
                            Convertable<Object, Object> adapter = (Convertable<Object, Object>) conversaoValores.findAdapterForEntity(valorConvertido.getClass());
                            if (adapter != null) {
                                valorConvertido = adapter.toDomain(valorConvertido); // converte a entidade para o domínio
                            } else {
                                throw new BadRequestException("Nenhum adaptador encontrado para a entidade: " + valorConvertido.getClass().getName());
                            }
                        }

                        field.set(obj, valorConvertido);
                    } else {
                        throw new BadRequestException("O atributo " + nomeAtributo + " não pode ser editado em lote.");
                    }
                } catch (NoSuchFieldException | IllegalAccessException e) {
                    throw new BadRequestException("Erro ao tentar acessar o atributo " + nomeAtributo);
                }
            }
            atualizar(obj);
        }

        return crudPai.atualizarEmLote(lista);
    }

    @Override
    public DPai substituirPorVersaoAntiga(Integer id, Integer versionId) {
        return crudPai.substituirPorVersaoAntiga(id, versionId);
    }

    @Override
    public void inativar(Integer id) {
        crudPai.inativar(id);
    }

    @Override
    public void excluir(Integer id) {
        crudPai.remover(id);
    }

    @Override
    public DPai montarEstrutura(DMontadorEstruturaPai montadorEstruturaPai) {
        DPai pai = estruturaPaiProcessor.montarPai(montadorEstruturaPai);
        validarRegistroDuplicado(pai);
        pai = incluir(pai);
        estruturaPaiProcessor.processarMedidasEFilhos(montadorEstruturaPai, pai);
        return atualizar(pai);
    }

    @Override
    public DPai montarEstruturaModulacao(DMontadorEstruturaPaiModulacao montadorEstruturaPaiModulacao) {
        DPai paiPrincipal = estruturaModulacaoBuilder.construir(montadorEstruturaPaiModulacao);
        return atualizar(paiPrincipal);
    }

    private void validarRegistroDuplicado(DPai domain){
        Collection<DPai> registrosExistentes = crudPai.pesquisarPorDescricao(domain.getDescricao());

        for (DPai existente : registrosExistentes) {
            if (!existente.getCodigo().equals(Optional.ofNullable(domain.getCodigo()).orElse(-1))) {
                if (DSituacaoEnum.ATIVO.equals(existente.getSituacao())) {
                    throw new RegistroDuplicadoException("Verifique o campo descrição.");
                } else if (DSituacaoEnum.INATIVO.equals(existente.getSituacao())){
                    throw new RegistroDuplicadoException("Já existe um registro inativo com essa descrição. Reative-o antes de criar um novo.");
                } else if (DSituacaoEnum.LIXEIRA.equals(existente.getSituacao())){
                    throw new RegistroDuplicadoException("Já existe um registro com essa descrição na lixeira. Reative-o antes de criar um novo.");
                }
            }
        }
    }

}