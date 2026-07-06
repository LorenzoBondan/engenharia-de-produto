package br.com.todeschini.domain.business.publico.poliester.api;

import br.com.todeschini.domain.business.publico.poliester.DPoliester;

import java.util.List;

public interface AlterarPoliesterEmLote {

    List<DPoliester> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores);
}
