package br.com.todeschini.domain.business.publico.filho.api;

import br.com.todeschini.domain.business.publico.filho.DFilho;

import java.util.List;

public interface FilhoService extends BuscarFilho, CriarFilho, AlterarFilho, RemoverFilho, InativarFilho, BuscarHistoricoFilho,
        SubstituirFilhoPorVersaoAntiga, AlterarFilhoEmLote, BuscarAtributosEditaveisEmLoteFilho {

    List<DFilho> pesquisarPorDescricaoEMedidas (String descricao, Integer cdmedidas); // fundos
}
