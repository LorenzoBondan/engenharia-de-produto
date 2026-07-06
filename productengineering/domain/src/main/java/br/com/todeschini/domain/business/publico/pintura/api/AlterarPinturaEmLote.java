package br.com.todeschini.domain.business.publico.pintura.api;

import br.com.todeschini.domain.business.publico.pintura.DPintura;

import java.util.List;

public interface AlterarPinturaEmLote {

    List<DPintura> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores);
}
