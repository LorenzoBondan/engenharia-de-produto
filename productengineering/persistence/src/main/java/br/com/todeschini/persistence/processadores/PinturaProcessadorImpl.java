package br.com.todeschini.persistence.processadores;

import br.com.todeschini.domain.business.processadores.PinturaProcessador;
import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.material.DMaterial;
import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;
import br.com.todeschini.domain.business.publico.materialusado.api.MaterialUsadoService;
import br.com.todeschini.domain.business.publico.pintura.DPintura;
import br.com.todeschini.domain.business.publico.pinturausada.DPinturaUsada;
import br.com.todeschini.persistence.publico.pintura.PinturaDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.pintura.PinturaQueryRepository;
import org.springframework.stereotype.Component;

@Component
public class PinturaProcessadorImpl implements PinturaProcessador {

    private final PinturaQueryRepository queryRepository;
    private final PinturaDomainToEntityAdapter adapter;
    private final MaterialUsadoService materialUsadoService;

    public PinturaProcessadorImpl(PinturaQueryRepository queryRepository, PinturaDomainToEntityAdapter adapter, MaterialUsadoService materialUsadoService) {
        this.queryRepository = queryRepository;
        this.adapter = adapter;
        this.materialUsadoService = materialUsadoService;
    }

    @Override
    public void processarMaterial(DFilho filho, DMaterial material) {
        DPintura pintura = adapter.toDomain(queryRepository.findByTipoPinturaAndCor(
                filho.getPai().getTipoPintura().getValue(), filho.getCor().getCodigo()
        ).iterator().next());
        incluirPintura(filho, pintura);
    }

    private void incluirPintura(DFilho filho, DPintura Pintura) {
        DPinturaUsada pinturaUsada = new DPinturaUsada();
        pinturaUsada.setMaterial(Pintura);
        pinturaUsada.setFilho(filho);
        pinturaUsada.setUnidadeMedida("M²");
        pinturaUsada.calcularQuantidadeLiquida();
        pinturaUsada.calcularQuantidadeBruta();
        pinturaUsada.calcularValor();
        DMaterialUsado materialUsado = materialUsadoService.incluir(pinturaUsada);
        filho.getMateriaisUsados().add(materialUsado);
    }
}
