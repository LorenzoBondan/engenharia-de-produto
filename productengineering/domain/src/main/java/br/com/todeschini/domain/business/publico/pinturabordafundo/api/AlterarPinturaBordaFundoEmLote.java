package br.com.todeschini.domain.business.publico.pinturabordafundo.api;

import br.com.todeschini.domain.business.publico.pinturabordafundo.DPinturaBordaFundo;

import java.util.List;

public interface AlterarPinturaBordaFundoEmLote {

    List<DPinturaBordaFundo> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores);
}
