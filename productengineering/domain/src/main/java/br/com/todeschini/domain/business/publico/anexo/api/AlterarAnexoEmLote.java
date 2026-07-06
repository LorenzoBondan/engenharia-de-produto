package br.com.todeschini.domain.business.publico.anexo.api;

import br.com.todeschini.domain.business.publico.anexo.DAnexo;

import java.util.List;

public interface AlterarAnexoEmLote {

    List<DAnexo> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores);
}
