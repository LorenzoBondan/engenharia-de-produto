package br.com.todeschini.persistence.processadores;

import br.com.todeschini.domain.business.processadores.PoliesterProcessador;
import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.material.DMaterial;
import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;
import br.com.todeschini.domain.business.publico.materialusado.api.MaterialUsadoService;
import br.com.todeschini.domain.business.publico.poliester.DPoliester;
import br.com.todeschini.domain.business.publico.poliesterusado.DPoliesterUsado;
import br.com.todeschini.persistence.publico.poliester.PoliesterDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.poliester.PoliesterRepository;
import org.springframework.stereotype.Component;

@Component
public class PoliesterProcessadorImpl implements PoliesterProcessador {

    private final PoliesterRepository repository;
    private final PoliesterDomainToEntityAdapter adapter;
    private final MaterialUsadoService materialUsadoService;

    public PoliesterProcessadorImpl(PoliesterRepository repository, PoliesterDomainToEntityAdapter adapter, MaterialUsadoService materialUsadoService) {
        this.repository = repository;
        this.adapter = adapter;
        this.materialUsadoService = materialUsadoService;
    }

    @Override
    public void processarMaterial(DFilho filho, DMaterial material) {
        DPoliester Poliester = adapter.toDomain(repository.findById(material.getCodigo()).get());
        incluirPoliester(filho, Poliester);
    }

    private void incluirPoliester(DFilho filho, DPoliester Poliester) {
        DPoliesterUsado PoliesterUsado = new DPoliesterUsado();
        PoliesterUsado.setMaterial(Poliester);
        PoliesterUsado.setFilho(filho);
        PoliesterUsado.setUnidadeMedida("M²");
        PoliesterUsado.calcularQuantidadeLiquida();
        PoliesterUsado.calcularQuantidadeBruta();
        PoliesterUsado.calcularValor();
        DMaterialUsado materialUsado = materialUsadoService.incluir(PoliesterUsado);
        filho.getMateriaisUsados().add(materialUsado);
    }
}
