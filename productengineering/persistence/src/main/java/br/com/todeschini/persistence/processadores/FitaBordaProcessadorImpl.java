package br.com.todeschini.persistence.processadores;

import br.com.todeschini.domain.business.processadores.FitaBordaProcessador;
import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.fitaborda.DFitaBorda;
import br.com.todeschini.domain.business.publico.fitabordausada.DFitaBordaUsada;
import br.com.todeschini.domain.business.publico.material.DMaterial;
import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;
import br.com.todeschini.domain.business.publico.materialusado.api.MaterialUsadoService;
import br.com.todeschini.persistence.publico.fitaborda.FitaBordaDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.fitaborda.FitaBordaQueryRepository;
import org.springframework.stereotype.Component;

@Component
public class FitaBordaProcessadorImpl implements FitaBordaProcessador {

    private final FitaBordaQueryRepository queryRepository;
    private final FitaBordaDomainToEntityAdapter adapter;
    private final MaterialUsadoService materialUsadoService;

    public FitaBordaProcessadorImpl(FitaBordaQueryRepository queryRepository, FitaBordaDomainToEntityAdapter adapter, MaterialUsadoService materialUsadoService) {
        this.queryRepository = queryRepository;
        this.adapter = adapter;
        this.materialUsadoService = materialUsadoService;
    }

    @Override
    public void processarMaterial(DFilho filho, DMaterial material) {
        DFitaBorda fitaBorda = adapter.toDomain(queryRepository.findByAlturaAndCor_Cdcor(
                filho.getMedidas().getEspessura() + 3, filho.getCor().getCodigo()));
        incluirFitaBorda(filho, fitaBorda);
    }

    private void incluirFitaBorda(DFilho filho, DFitaBorda FitaBorda) {
        DFitaBordaUsada FitaBordaUsada = new DFitaBordaUsada();
        FitaBordaUsada.setMaterial(FitaBorda);
        FitaBordaUsada.setFilho(filho);
        FitaBordaUsada.setUnidadeMedida("M");
        FitaBordaUsada.calcularQuantidadeLiquida();
        FitaBordaUsada.calcularQuantidadeBruta();
        FitaBordaUsada.calcularValor();
        DMaterialUsado materialUsado = materialUsadoService.incluir(FitaBordaUsada);
        filho.getMateriaisUsados().add(materialUsado);
    }
}
