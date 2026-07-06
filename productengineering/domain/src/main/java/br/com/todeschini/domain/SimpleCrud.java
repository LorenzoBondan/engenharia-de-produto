package br.com.todeschini.domain;

import br.com.todeschini.domain.business.publico.history.DHistory;

import java.util.List;

/**
 * Métodos padrão para CRUDs.
 * @param <T> é a entidade
 * @param <J> é a PK da entidade
 */
public interface SimpleCrud<T, J>{

    Paged<T> buscarTodos(PageableRequest request);

    T inserir(T obj);

    T atualizar(T obj);

    void remover(J obj);

    T buscar(J obj);

    void inativar(J obj);

    List<DHistory<T>> buscarHistorico(J id);

    T substituirPorVersaoAntiga(J id, J versionId);

    List<String> buscarAtributosEditaveisEmLote();

    List<T> atualizarEmLote(List<T> obj);
}
