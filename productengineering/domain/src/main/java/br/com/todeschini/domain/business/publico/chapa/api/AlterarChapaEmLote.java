package br.com.todeschini.domain.business.publico.chapa.api;

import br.com.todeschini.domain.business.publico.chapa.DChapa;

import java.util.List;

public interface AlterarChapaEmLote {

    List<DChapa> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores);
}
