package br.com.todeschini.domain.business.publico.pintura.api;

public interface PinturaService extends BuscarPintura, CriarPintura, AlterarPintura, RemoverPintura, InativarPintura,
        BuscarHistoricoPintura, SubstituirPinturaPorVersaoAntiga,
        AlterarPinturaEmLote, BuscarAtributosEditaveisEmLotePintura {
}
