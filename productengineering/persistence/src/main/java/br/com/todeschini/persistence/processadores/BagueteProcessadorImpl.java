package br.com.todeschini.persistence.processadores;

import br.com.todeschini.domain.business.processadores.BagueteProcessador;
import br.com.todeschini.domain.business.publico.baguete.DBaguete;
import br.com.todeschini.domain.business.publico.bagueteusado.DBagueteUsado;
import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.material.DMaterial;
import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;
import br.com.todeschini.domain.business.publico.materialusado.api.MaterialUsadoService;
import br.com.todeschini.persistence.publico.baguete.BagueteDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.baguete.BagueteRepository;
import org.springframework.stereotype.Component;

@Component
public class BagueteProcessadorImpl implements BagueteProcessador {

    private final BagueteRepository repository;
    private final BagueteDomainToEntityAdapter adapter;
    private final MaterialUsadoService materialUsadoService;

    public BagueteProcessadorImpl(BagueteRepository repository, BagueteDomainToEntityAdapter adapter, MaterialUsadoService materialUsadoService) {
        this.repository = repository;
        this.adapter = adapter;
        this.materialUsadoService = materialUsadoService;
    }

    @Override
    public void processarMaterial(DFilho filho, DMaterial material) {
        DBaguete Baguete = adapter.toDomain(repository.findById(material.getCodigo()).get());
        incluirBaguete(filho, Baguete);
    }

    private void incluirBaguete(DFilho filho, DBaguete Baguete) {
        DBagueteUsado bagueteUsado = new DBagueteUsado();
        bagueteUsado.setMaterial(Baguete);
        bagueteUsado.setFilho(filho);
        bagueteUsado.setUnidadeMedida("M²");
        bagueteUsado.calcularQuantidadeLiquida();
        bagueteUsado.calcularQuantidadeBruta();
        bagueteUsado.calcularValor();
        DMaterialUsado materialUsado = materialUsadoService.incluir(bagueteUsado);
        filho.getMateriaisUsados().add(materialUsado);
    }
}
