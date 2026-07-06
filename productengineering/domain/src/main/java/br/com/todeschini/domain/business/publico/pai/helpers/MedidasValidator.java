package br.com.todeschini.domain.business.publico.pai.helpers;

import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.medidas.DMedidas;
import br.com.todeschini.domain.business.publico.medidas.api.MedidasService;

import java.util.Collection;

public class MedidasValidator {

    private final MedidasService medidasService;

    public MedidasValidator(MedidasService medidasService) {
        this.medidasService = medidasService;
    }

    public DMedidas verificarOuIncluir(DMedidas medida) {
        Collection<? extends DMedidas> medidasExistentes = medidasService.buscarPorAlturaELarguraEEspessura(
                medida.getAltura(),
                medida.getLargura(),
                medida.getEspessura()
        );

        if (!medidasExistentes.isEmpty()) {
            DMedidas existente = medidasExistentes.iterator().next();
            medida.setCodigo(existente.getCodigo());
            medida.setSituacao(DSituacaoEnum.valueOf(existente.getSituacao().name()));
            return medida;
        }

        return medidasService.incluir(medida);
    }
}
