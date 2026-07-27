package br.com.todeschini.persistence.processadores;

import br.com.todeschini.domain.business.processadores.PlasticoProcessador;
import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.material.DMaterial;
import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;
import br.com.todeschini.domain.business.publico.materialusado.api.MaterialUsadoService;
import br.com.todeschini.domain.business.publico.plastico.DPlastico;
import br.com.todeschini.domain.business.publico.plasticousado.DPlasticoUsado;
import br.com.todeschini.persistence.publico.plastico.PlasticoDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.plastico.PlasticoRepository;
import org.springframework.stereotype.Component;

@Component
public class PlasticoProcessadorImpl implements PlasticoProcessador {

    private final PlasticoRepository repository;
    private final PlasticoDomainToEntityAdapter adapter;
    private final MaterialUsadoService materialUsadoService;

    public PlasticoProcessadorImpl(PlasticoRepository repository, PlasticoDomainToEntityAdapter adapter, MaterialUsadoService materialUsadoService) {
        this.repository = repository;
        this.adapter = adapter;
        this.materialUsadoService = materialUsadoService;
    }

    @Override
    public void processarMaterial(DFilho filho, DMaterial material) {
        DPlastico Plastico = adapter.toDomain(repository.findById(material.getCodigo()).get());
        incluirPlastico(filho, Plastico);
    }

    private void incluirPlastico(DFilho filho, DPlastico Plastico) {
        DPlasticoUsado PlasticoUsado = new DPlasticoUsado();
        PlasticoUsado.setMaterial(Plastico);
        PlasticoUsado.setFilho(filho);
        PlasticoUsado.setUnidadeMedida("M²");
        PlasticoUsado.calcularQuantidadeLiquida();
        PlasticoUsado.calcularQuantidadeBruta();
        PlasticoUsado.calcularValor();
        DMaterialUsado materialUsado = materialUsadoService.incluir(PlasticoUsado);
        filho.getMateriaisUsados().add(materialUsado);
    }
}
