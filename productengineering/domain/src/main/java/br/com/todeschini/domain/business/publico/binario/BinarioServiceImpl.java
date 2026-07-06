package br.com.todeschini.domain.business.publico.binario;

import br.com.todeschini.domain.ConversaoValores;
import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.binario.api.BinarioService;
import br.com.todeschini.domain.business.publico.binario.spi.CrudBinario;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.exceptions.BadRequestException;
import br.com.todeschini.domain.metadata.BatchEditable;
import br.com.todeschini.domain.metadata.DomainService;
import br.com.todeschini.domain.metadata.Entidade;

import java.lang.reflect.Field;
import java.util.List;

@DomainService
public class BinarioServiceImpl implements BinarioService {

    private final CrudBinario crudBinario;
    private final ConversaoValores conversaoValores;

    public BinarioServiceImpl(CrudBinario crudBinario, ConversaoValores conversaoValores) {
        this.crudBinario = crudBinario;
        this.conversaoValores = conversaoValores;
    }

    @Override
    public Paged<DBinario> buscar(PageableRequest request) {
        return crudBinario.buscarTodos(request);
    }

    @Override
    public DBinario buscar(Integer id) {
        return crudBinario.buscar(id);
    }

    @Override
    public List<DHistory<DBinario>> buscarHistorico(Integer id) {
        return crudBinario.buscarHistorico(id);
    }

    @Override
    public List<String> buscarAtributosEditaveisEmLote() {
        return crudBinario.buscarAtributosEditaveisEmLote();
    }

    @Override
    public DBinario incluir(DBinario domain) {
        domain.validar();
        return crudBinario.inserir(domain);
    }

    @Override
    public DBinario atualizar(DBinario domain) {
        domain.validar();
        return crudBinario.atualizar(domain);
    }

    @Override
    public List<DBinario> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores) {
        if (atributos.size() != valores.size()) {
            throw new BadRequestException("O número de atributos e valores deve ser igual.");
        }

        List<DBinario> lista = codigos.stream()
                .map(this::buscar)
                .toList();

        for (DBinario obj : lista) {
            for (int i = 0; i < atributos.size(); i++) {
                String nomeAtributo = atributos.get(i);
                Object valorAtributo = valores.get(i);

                Field field;
                try {
                    field = DBinario.class.getDeclaredField(nomeAtributo);
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

        return crudBinario.atualizarEmLote(lista);
    }

    @Override
    public DBinario substituirPorVersaoAntiga(Integer id, Integer versionId) {
        return crudBinario.substituirPorVersaoAntiga(id, versionId);
    }

    @Override
    public void inativar(Integer id) {
        crudBinario.inativar(id);
    }

    @Override
    public void excluir(Integer id) {
        crudBinario.remover(id);
    }
}
