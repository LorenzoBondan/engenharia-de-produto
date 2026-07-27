package br.com.todeschini.persistence.processadores;

import br.com.todeschini.domain.business.processadores.TntProcessador;
import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.material.DMaterial;
import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;
import br.com.todeschini.domain.business.publico.materialusado.api.MaterialUsadoService;
import br.com.todeschini.domain.business.publico.tnt.DTnt;
import br.com.todeschini.domain.business.publico.tntusado.DTntUsado;
import br.com.todeschini.persistence.publico.tnt.TntDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.tnt.TntRepository;
import org.springframework.stereotype.Component;

@Component
public class TntProcessadorImpl implements TntProcessador {

    private final TntRepository repository;
    private final TntDomainToEntityAdapter adapter;
    private final MaterialUsadoService materialUsadoService;

    public TntProcessadorImpl(TntRepository repository, TntDomainToEntityAdapter adapter, MaterialUsadoService materialUsadoService) {
        this.repository = repository;
        this.adapter = adapter;
        this.materialUsadoService = materialUsadoService;
    }

    @Override
    public void processarMaterial(DFilho filho, DMaterial material) {
        DTnt Tnt = adapter.toDomain(repository.findById(material.getCodigo()).get());
        incluirTnt(filho, Tnt);
    }

    private void incluirTnt(DFilho filho, DTnt Tnt) {
        DTntUsado tntUsado = new DTntUsado();
        tntUsado.setMaterial(Tnt);
        tntUsado.setFilho(filho);
        tntUsado.setUnidadeMedida("M²");
        tntUsado.calcularQuantidadeLiquida();
        tntUsado.calcularQuantidadeBruta();
        tntUsado.calcularValor();
        DMaterialUsado materialUsado = materialUsadoService.incluir(tntUsado);
        filho.getMateriaisUsados().add(materialUsado);
    }
}
