package br.com.todeschini.domain.business.publico.baguete.api;

import br.com.todeschini.domain.business.publico.baguete.DBaguete;

import java.util.List;

public interface AlterarBagueteEmLote {

    List<DBaguete> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores);
}
