package br.com.todeschini.persistence.filters;

import br.com.todeschini.persistence.entities.enums.SituacaoEnum;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

/**
 * Componente responsável por modificar uma Specification existente
 * para adicionar o filtro de exclusão de registros com situacao 'LIXEIRA'.
 */
@Component
public class SituacaoFilter<T> {

    private static final String SITUACAO = "situacao";
    private static final SituacaoEnum EXCLUIR_SITUACAO = SituacaoEnum.LIXEIRA;

    /**
     * Modifica a Specification recebida adicionando a condição
     * situacao != 'LIXEIRA'.
     *
     * @param originalSpec Specification original a ser modificada.
     * @return Specification modificada com a nova condição.
     */
    public Specification<T> addExcludeSituacaoLixeira(Specification<T> originalSpec) {
        Specification<T> situacaoSpec = (root, query, builder) ->
                builder.notEqual(root.get(SITUACAO), EXCLUIR_SITUACAO);

        // Adiciona a nova condição à Specification original (ou cria uma nova caso seja null)
        return originalSpec != null ? originalSpec.and(situacaoSpec) : situacaoSpec;
    }
}
