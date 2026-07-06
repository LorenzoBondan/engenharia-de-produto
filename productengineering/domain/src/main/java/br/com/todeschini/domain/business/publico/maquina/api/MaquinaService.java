package br.com.todeschini.domain.business.publico.maquina.api;

public interface MaquinaService extends BuscarMaquina, CriarMaquina, AlterarMaquina, RemoverMaquina, InativarMaquina,
        BuscarHistoricoMaquina, SubstituirMaquinaPorVersaoAntiga,
        AlterarMaquinaEmLote, BuscarAtributosEditaveisEmLoteMaquina {
}
