package br.com.todeschini.domain.business.publico.anexo;

import br.com.todeschini.domain.ConversaoValores;
import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.anexo.api.AnexoService;
import br.com.todeschini.domain.business.publico.anexo.spi.CrudAnexo;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.exceptions.BadRequestException;
import br.com.todeschini.domain.metadata.BatchEditable;
import br.com.todeschini.domain.metadata.DomainService;
import br.com.todeschini.domain.metadata.Entidade;

import java.lang.reflect.Field;
import java.util.List;

@DomainService
public class AnexoServiceImpl implements AnexoService {

    private final CrudAnexo crudAnexo;
    private final ConversaoValores conversaoValores;

    public AnexoServiceImpl(CrudAnexo crudAnexo, ConversaoValores conversaoValores) {
        this.crudAnexo = crudAnexo;
        this.conversaoValores = conversaoValores;
    }

    @Override
    public Paged<DAnexo> buscar(PageableRequest request) {
        return crudAnexo.buscarTodos(request);
    }

    @Override
    public DAnexo buscar(Integer id) {
        return crudAnexo.buscar(id);
    }

    @Override
    public List<DHistory<DAnexo>> buscarHistorico(Integer id) {
        return crudAnexo.buscarHistorico(id);
    }

    @Override
    public List<String> buscarAtributosEditaveisEmLote() {
        return crudAnexo.buscarAtributosEditaveisEmLote();
    }

    @Override
    public DAnexo incluir(DAnexo domain) {
        domain.validar();
        return crudAnexo.inserir(domain);
    }

    @Override
    public DAnexo atualizar(DAnexo domain) {
        domain.validar();
        return crudAnexo.atualizar(domain);
    }

    @Override
    public List<DAnexo> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores) {
        if (atributos.size() != valores.size()) {
            throw new BadRequestException("O número de atributos e valores deve ser igual.");
        }

        List<DAnexo> lista = codigos.stream()
                .map(this::buscar)
                .toList();

        for (DAnexo obj : lista) {
            for (int i = 0; i < atributos.size(); i++) {
                String nomeAtributo = atributos.get(i);
                Object valorAtributo = valores.get(i);

                Field field;
                try {
                    field = DAnexo.class.getDeclaredField(nomeAtributo);
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

        return crudAnexo.atualizarEmLote(lista);
    }

    @Override
    public DAnexo substituirPorVersaoAntiga(Integer id, Integer versionId) {
        return crudAnexo.substituirPorVersaoAntiga(id, versionId);
    }

    @Override
    public void inativar(Integer id) {
        crudAnexo.inativar(id);
    }

    @Override
    public void excluir(Integer id) {
        crudAnexo.remover(id);
    }
}
