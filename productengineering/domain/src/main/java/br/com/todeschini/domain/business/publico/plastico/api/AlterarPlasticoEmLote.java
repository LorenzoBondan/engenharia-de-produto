package br.com.todeschini.domain.business.publico.plastico.api;

import br.com.todeschini.domain.business.publico.plastico.DPlastico;

import java.util.List;

public interface AlterarPlasticoEmLote {

    List<DPlastico> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores);
}
