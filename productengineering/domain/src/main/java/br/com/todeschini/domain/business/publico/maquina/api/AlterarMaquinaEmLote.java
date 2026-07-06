package br.com.todeschini.domain.business.publico.maquina.api;

import br.com.todeschini.domain.business.publico.maquina.DMaquina;

import java.util.List;

public interface AlterarMaquinaEmLote {

    List<DMaquina> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores);
}
