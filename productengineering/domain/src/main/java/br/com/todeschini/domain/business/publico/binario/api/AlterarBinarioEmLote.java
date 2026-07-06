package br.com.todeschini.domain.business.publico.binario.api;

import br.com.todeschini.domain.business.publico.binario.DBinario;

import java.util.List;

public interface AlterarBinarioEmLote {

    List<DBinario> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores);
}
