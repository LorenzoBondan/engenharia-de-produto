package br.com.todeschini.domain.business.publico.poliester;

import br.com.todeschini.domain.ConversaoValores;
import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.poliester.api.PoliesterService;
import br.com.todeschini.domain.business.publico.poliester.spi.CrudPoliester;
import br.com.todeschini.domain.exceptions.BadRequestException;
import br.com.todeschini.domain.exceptions.RegistroDuplicadoException;
import br.com.todeschini.domain.metadata.BatchEditable;
import br.com.todeschini.domain.metadata.DomainService;
import br.com.todeschini.domain.metadata.Entidade;

import java.lang.reflect.Field;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@DomainService
public class PoliesterServiceImpl implements PoliesterService {

    private final CrudPoliester crudPoliester;
    private final ConversaoValores conversaoValores;

    public PoliesterServiceImpl(CrudPoliester crudPoliester, ConversaoValores conversaoValores) {
        this.crudPoliester = crudPoliester;
        this.conversaoValores = conversaoValores;
    }

    @Override
    public Paged<DPoliester> buscar(PageableRequest request) {
        return crudPoliester.buscarTodos(request);
    }

    @Override
    public DPoliester buscar(Integer id) {
        return crudPoliester.buscar(id);
    }

    @Override
    public List<DHistory<DPoliester>> buscarHistorico(Integer id) {
        return crudPoliester.buscarHistorico(id);
    }

    @Override
    public List<String> buscarAtributosEditaveisEmLote() {
        return crudPoliester.buscarAtributosEditaveisEmLote();
    }

    @Override
    public DPoliester incluir(DPoliester domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudPoliester.inserir(domain);
    }

    @Override
    public DPoliester atualizar(DPoliester domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudPoliester.atualizar(domain);
    }

    @Override
    public List<DPoliester> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores) {
        if (atributos.size() != valores.size()) {
            throw new BadRequestException("O número de atributos e valores deve ser igual.");
        }

        List<DPoliester> lista = codigos.stream()
                .map(this::buscar)
                .toList();

        for (DPoliester obj : lista) {
            for (int i = 0; i < atributos.size(); i++) {
                String nomeAtributo = atributos.get(i);
                Object valorAtributo = valores.get(i);

                Field field;
                try {
                    field = conversaoValores.buscarCampoNaHierarquia(DPoliester.class, nomeAtributo);
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

        return crudPoliester.atualizarEmLote(lista);
    }

    @Override
    public DPoliester substituirPorVersaoAntiga(Integer id, Integer versionId) {
        return crudPoliester.substituirPorVersaoAntiga(id, versionId);
    }

    @Override
    public void inativar(Integer id) {
        crudPoliester.inativar(id);
    }

    @Override
    public void excluir(Integer id) {
        crudPoliester.remover(id);
    }

    private void validarRegistroDuplicado(DPoliester domain){
        Collection<DPoliester> registrosExistentes = crudPoliester.pesquisarPorDescricao(domain.getDescricao());

        for (DPoliester existente : registrosExistentes) {
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
