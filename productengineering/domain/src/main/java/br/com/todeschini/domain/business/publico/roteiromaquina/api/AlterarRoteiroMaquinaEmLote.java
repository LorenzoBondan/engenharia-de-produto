package br.com.todeschini.domain.business.publico.roteiromaquina.api;

import br.com.todeschini.domain.business.publico.roteiromaquina.DRoteiroMaquina;

import java.util.List;

public interface AlterarRoteiroMaquinaEmLote {

    List<DRoteiroMaquina> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores);
}
