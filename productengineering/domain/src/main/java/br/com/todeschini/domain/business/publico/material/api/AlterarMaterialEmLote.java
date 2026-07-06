package br.com.todeschini.domain.business.publico.material.api;

import br.com.todeschini.domain.business.publico.material.DMaterial;

import java.util.List;

public interface AlterarMaterialEmLote {

    List<DMaterial> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores);
}
