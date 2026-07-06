package br.com.todeschini.domain.business.publico.acessorio.api;

import br.com.todeschini.domain.business.publico.acessorio.DAcessorio;

import java.util.List;

public interface AlterarAcessorioEmLote {

    List<DAcessorio> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores);
}
