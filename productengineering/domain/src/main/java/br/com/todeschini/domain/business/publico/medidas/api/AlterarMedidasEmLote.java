package br.com.todeschini.domain.business.publico.medidas.api;

import br.com.todeschini.domain.business.publico.medidas.DMedidas;

import java.util.List;

public interface AlterarMedidasEmLote {

    List<DMedidas> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores);
}
