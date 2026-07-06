package br.com.todeschini.domain.business.publico.filho;

import br.com.todeschini.domain.ConversaoValores;
import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.filho.api.FilhoService;
import br.com.todeschini.domain.business.publico.filho.spi.CrudFilho;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.exceptions.BadRequestException;
import br.com.todeschini.domain.exceptions.UniqueConstraintViolationException;
import br.com.todeschini.domain.metadata.BatchEditable;
import br.com.todeschini.domain.metadata.DomainService;
import br.com.todeschini.domain.metadata.Entidade;

import java.lang.reflect.Field;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@DomainService
public class FilhoServiceImpl implements FilhoService {

    private final CrudFilho crudFilho;
    private final ConversaoValores conversaoValores;

    public FilhoServiceImpl(CrudFilho crudFilho, ConversaoValores conversaoValores) {
        this.crudFilho = crudFilho;
        this.conversaoValores = conversaoValores;
    }

    @Override
    public Paged<DFilho> buscar(PageableRequest request) {
        return crudFilho.buscarTodos(request);
    }

    @Override
    public List<DFilho> pesquisarPorDescricaoEMedidas(String descricao, Integer cdmedidas) {
        return crudFilho.pesquisarPorDescricaoEMedidas(descricao, cdmedidas);
    }

    @Override
    public DFilho buscar(Integer id) {
        return crudFilho.buscar(id);
    }

    @Override
    public List<DHistory<DFilho>> buscarHistorico(Integer id) {
        return crudFilho.buscarHistorico(id);
    }

    @Override
    public List<String> buscarAtributosEditaveisEmLote() {
        return crudFilho.buscarAtributosEditaveisEmLote();
    }

    @Override
    public DFilho incluir(DFilho domain) {
        domain.validar();
        validarRegistroDuplicado(domain);
        return crudFilho.inserir(domain);
    }

    @Override
    public DFilho atualizar(DFilho domain) {
        domain.validar();
        validarRegistroDuplicado(domain);
        return crudFilho.atualizar(domain);
    }

    @Override
    public List<DFilho> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores) {
        if (atributos.size() != valores.size()) {
            throw new BadRequestException("O número de atributos e valores deve ser igual.");
        }

        List<DFilho> lista = codigos.stream()
                .map(this::buscar)
                .toList();

        for (DFilho obj : lista) {
            for (int i = 0; i < atributos.size(); i++) {
                String nomeAtributo = atributos.get(i);
                Object valorAtributo = valores.get(i);

                Field field;
                try {
                    field = conversaoValores.buscarCampoNaHierarquia(DFilho.class, nomeAtributo);
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

        return crudFilho.atualizarEmLote(lista);
    }

    @Override
    public DFilho substituirPorVersaoAntiga(Integer id, Integer versionId) {
        return crudFilho.substituirPorVersaoAntiga(id, versionId);
    }

    @Override
    public void inativar(Integer id) {
        crudFilho.inativar(id);
    }

    @Override
    public void excluir(Integer id) {
        crudFilho.remover(id);
    }

    private void validarRegistroDuplicado(DFilho domain){
        Collection<DFilho> registrosExistentes = crudFilho.pesquisarPorDescricaoECorEMedidas(
                domain.getDescricao(), domain.getCor().getCodigo(), domain.getMedidas().getCodigo()
        );

        for (DFilho existente : registrosExistentes) {
            if (!existente.getCodigo().equals(Optional.ofNullable(domain.getCodigo()).orElse(-1))) {
                if (DSituacaoEnum.ATIVO.equals(existente.getSituacao())) {
                    throw new UniqueConstraintViolationException("Registro duplicado para a combinação de descrição, cor e medidas.");
                } else if (DSituacaoEnum.INATIVO.equals(existente.getSituacao())){
                    throw new UniqueConstraintViolationException("Já existe um registro inativo com essa combinação de descrição, cor e medidas. Reative-o antes de criar um novo.");
                } else if (DSituacaoEnum.LIXEIRA.equals(existente.getSituacao())){
                    throw new UniqueConstraintViolationException("Já existe um registro com essa combinação de descrição, cor e medidas na lixeira. Reative-o antes de criar um novo.");
                }
            }
        }
    }
}
