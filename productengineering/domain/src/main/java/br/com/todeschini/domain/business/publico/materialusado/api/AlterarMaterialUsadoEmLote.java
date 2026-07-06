package br.com.todeschini.domain.business.publico.materialusado.api;

import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;

import java.util.List;

public interface AlterarMaterialUsadoEmLote {

    List<DMaterialUsado> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores);
}
