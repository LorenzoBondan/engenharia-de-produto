package br.com.todeschini.domain.business.publico.cola.api;

import br.com.todeschini.domain.business.publico.cola.DCola;

import java.util.List;

public interface AlterarColaEmLote {

    List<DCola> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores);
}
