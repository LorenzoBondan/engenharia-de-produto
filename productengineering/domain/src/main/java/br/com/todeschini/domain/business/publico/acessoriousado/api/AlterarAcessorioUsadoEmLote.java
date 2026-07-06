package br.com.todeschini.domain.business.publico.acessoriousado.api;

import br.com.todeschini.domain.business.publico.acessoriousado.DAcessorioUsado;

import java.util.List;

public interface AlterarAcessorioUsadoEmLote {

    List<DAcessorioUsado> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores);
}
