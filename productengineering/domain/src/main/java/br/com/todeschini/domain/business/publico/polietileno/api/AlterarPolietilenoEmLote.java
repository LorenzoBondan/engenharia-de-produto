package br.com.todeschini.domain.business.publico.polietileno.api;

import br.com.todeschini.domain.business.publico.polietileno.DPolietileno;

import java.util.List;

public interface AlterarPolietilenoEmLote {

    List<DPolietileno> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores);
}
