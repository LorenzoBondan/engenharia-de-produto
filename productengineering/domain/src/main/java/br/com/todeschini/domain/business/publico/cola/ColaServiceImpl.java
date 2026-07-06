package br.com.todeschini.domain.business.publico.cola;

import br.com.todeschini.domain.ConversaoValores;
import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.cola.api.ColaService;
import br.com.todeschini.domain.business.publico.cola.spi.CrudCola;
import br.com.todeschini.domain.business.publico.history.DHistory;
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
public class ColaServiceImpl implements ColaService {

    private final CrudCola crudCola;
    private final ConversaoValores conversaoValores;

    public ColaServiceImpl(CrudCola crudCola, ConversaoValores conversaoValores) {
        this.crudCola = crudCola;
        this.conversaoValores = conversaoValores;
    }

    @Override
    public Paged<DCola> buscar(PageableRequest request) {
        return crudCola.buscarTodos(request);
    }

    @Override
    public DCola buscar(Integer id) {
        return crudCola.buscar(id);
    }

    @Override
    public List<DHistory<DCola>> buscarHistorico(Integer id) {
        return crudCola.buscarHistorico(id);
    }

    @Override
    public List<String> buscarAtributosEditaveisEmLote() {
        return crudCola.buscarAtributosEditaveisEmLote();
    }

    @Override
    public DCola incluir(DCola domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudCola.inserir(domain);
    }

    @Override
    public DCola atualizar(DCola domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudCola.atualizar(domain);
    }

    @Override
    public List<DCola> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores) {
        if (atributos.size() != valores.size()) {
            throw new BadRequestException("O número de atributos e valores deve ser igual.");
        }

        List<DCola> lista = codigos.stream()
                .map(this::buscar)
                .toList();

        for (DCola obj : lista) {
            for (int i = 0; i < atributos.size(); i++) {
                String nomeAtributo = atributos.get(i);
                Object valorAtributo = valores.get(i);

                Field field;
                try {
                    field = conversaoValores.buscarCampoNaHierarquia(DCola.class, nomeAtributo);
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

        return crudCola.atualizarEmLote(lista);
    }

    @Override
    public DCola substituirPorVersaoAntiga(Integer id, Integer versionId) {
        return crudCola.substituirPorVersaoAntiga(id, versionId);
    }

    @Override
    public void inativar(Integer id) {
        crudCola.inativar(id);
    }

    @Override
    public void excluir(Integer id) {
        crudCola.remover(id);
    }

    private void validarRegistroDuplicado(DCola domain){
        Collection<DCola> registrosExistentes = crudCola.pesquisarPorDescricao(domain.getDescricao());

        for (DCola existente : registrosExistentes) {
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
