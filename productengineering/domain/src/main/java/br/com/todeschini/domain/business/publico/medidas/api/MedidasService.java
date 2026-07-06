package br.com.todeschini.domain.business.publico.medidas.api;

public interface MedidasService extends BuscarMedidas, CriarMedidas, AlterarMedidas, RemoverMedidas, InativarMedidas,
        BuscarHistoricoMedidas, SubstituirMedidasPorVersaoAntiga,
        AlterarMedidasEmLote, BuscarAtributosEditaveisEmLoteMedidas {
}
