package br.com.todeschini.domain.business.publico.pai.api;

import br.com.todeschini.domain.business.publico.pai.DPai;

import java.util.List;

public interface AlterarPaiEmLote {

    List<DPai> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores);
}
