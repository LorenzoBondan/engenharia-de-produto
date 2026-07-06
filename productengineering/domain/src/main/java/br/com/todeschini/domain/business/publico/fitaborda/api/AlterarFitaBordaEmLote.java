package br.com.todeschini.domain.business.publico.fitaborda.api;

import br.com.todeschini.domain.business.publico.fitaborda.DFitaBorda;

import java.util.List;

public interface AlterarFitaBordaEmLote {

    List<DFitaBorda> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores);
}
