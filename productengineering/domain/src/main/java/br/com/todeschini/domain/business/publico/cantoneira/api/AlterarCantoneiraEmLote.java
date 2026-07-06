package br.com.todeschini.domain.business.publico.cantoneira.api;

import br.com.todeschini.domain.business.publico.cantoneira.DCantoneira;

import java.util.List;

public interface AlterarCantoneiraEmLote {

    List<DCantoneira> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores);
}
