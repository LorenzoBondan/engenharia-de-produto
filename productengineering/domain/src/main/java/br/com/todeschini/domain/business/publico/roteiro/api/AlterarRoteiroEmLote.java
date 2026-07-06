package br.com.todeschini.domain.business.publico.roteiro.api;

import br.com.todeschini.domain.business.publico.roteiro.DRoteiro;

import java.util.List;

public interface AlterarRoteiroEmLote {

    List<DRoteiro> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores);
}
