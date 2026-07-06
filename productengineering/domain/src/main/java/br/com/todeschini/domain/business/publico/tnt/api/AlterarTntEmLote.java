package br.com.todeschini.domain.business.publico.tnt.api;

import br.com.todeschini.domain.business.publico.tnt.DTnt;

import java.util.List;

public interface AlterarTntEmLote {

    List<DTnt> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores);
}
