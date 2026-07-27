package br.com.todeschini.persistence.processadores;

import br.com.todeschini.domain.business.processadores.PinturaBordaFundoProcessador;
import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.material.DMaterial;
import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;
import br.com.todeschini.domain.business.publico.materialusado.api.MaterialUsadoService;
import br.com.todeschini.domain.business.publico.pinturabordafundo.DPinturaBordaFundo;
import br.com.todeschini.domain.business.publico.pinturabordafundousada.DPinturaBordaFundoUsada;
import br.com.todeschini.persistence.publico.pinturabordafundo.PinturaBordaFundoDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.pinturabordafundo.PinturaBordaFundoRepository;
import org.springframework.stereotype.Component;

@Component
public class PinturaBordaFundoProcessadorImpl implements PinturaBordaFundoProcessador {

    private final PinturaBordaFundoRepository repository;
    private final PinturaBordaFundoDomainToEntityAdapter adapter;
    private final MaterialUsadoService materialUsadoService;

    public PinturaBordaFundoProcessadorImpl(PinturaBordaFundoRepository repository, PinturaBordaFundoDomainToEntityAdapter adapter, MaterialUsadoService materialUsadoService) {
        this.repository = repository;
        this.adapter = adapter;
        this.materialUsadoService = materialUsadoService;
    }

    @Override
    public void processarMaterial(DFilho filho, DMaterial material) {
        DPinturaBordaFundo pinturaBordaFundo = adapter.toDomain(repository.findById(material.getCodigo()).get());
        incluirPinturaBordaFundo(filho, pinturaBordaFundo);
    }

    private void incluirPinturaBordaFundo(DFilho filho, DPinturaBordaFundo PinturaBordaFundo) {
        DPinturaBordaFundoUsada pinturaBordaFundoUsada = new DPinturaBordaFundoUsada();
        pinturaBordaFundoUsada.setMaterial(PinturaBordaFundo);
        pinturaBordaFundoUsada.setFilho(filho);
        pinturaBordaFundoUsada.setUnidadeMedida("M");
        pinturaBordaFundoUsada.calcularQuantidadeLiquida();
        pinturaBordaFundoUsada.calcularQuantidadeBruta();
        pinturaBordaFundoUsada.calcularValor();
        DMaterialUsado materialUsado = materialUsadoService.incluir(pinturaBordaFundoUsada);
        filho.getMateriaisUsados().add(materialUsado);
    }
}
