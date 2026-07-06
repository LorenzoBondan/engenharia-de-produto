package br.com.todeschini.domain.business.publico.material.api;

public interface MaterialService extends BuscarMaterial, CriarMaterial, AlterarMaterial, RemoverMaterial, InativarMaterial,
        BuscarHistoricoMaterial, SubstituirMaterialPorVersaoAntiga,
        AlterarMaterialEmLote, BuscarAtributosEditaveisEmLoteMaterial {
}
