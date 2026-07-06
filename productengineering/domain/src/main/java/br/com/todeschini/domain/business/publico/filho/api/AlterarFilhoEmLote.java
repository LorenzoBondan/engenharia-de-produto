package br.com.todeschini.domain.business.publico.filho.api;

import br.com.todeschini.domain.business.publico.filho.DFilho;

import java.util.List;

public interface AlterarFilhoEmLote {

    List<DFilho> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores);
}
