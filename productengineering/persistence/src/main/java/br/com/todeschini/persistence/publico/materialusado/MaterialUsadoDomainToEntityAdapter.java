package br.com.todeschini.persistence.publico.materialusado;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.publico.Filho;
import br.com.todeschini.persistence.entities.publico.MaterialUsado;
import br.com.todeschini.persistence.publico.cor.CorDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.material.MaterialDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.medidas.MedidasDomainToEntityAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@EntityAdapter(entityClass = MaterialUsado.class)
public class MaterialUsadoDomainToEntityAdapter implements Convertable<MaterialUsado, DMaterialUsado> {

    @Autowired
    private MaterialDomainToEntityAdapter materialDomainToEntityAdapter;
    @Autowired
    private MedidasDomainToEntityAdapter medidasDomainToEntityAdapter;
    @Autowired
    private CorDomainToEntityAdapter corDomainToEntityAdapter;

    @Override
    public MaterialUsado toEntity(DMaterialUsado domain) {
        return MaterialUsado.builder()
                .cdmaterialUsado(domain.getCodigo())
                .filho(new Filho(
                        domain.getFilho().getCodigo(),
                        corDomainToEntityAdapter.toEntity(domain.getFilho().getCor()),
                        medidasDomainToEntityAdapter.toEntity(domain.getFilho().getMedidas())
                ))
                .material(Optional.ofNullable(domain.getMaterial())
                        .map(material -> materialDomainToEntityAdapter.toEntity(material))
                        .orElse(null))
                .quantidadeLiquida(domain.getQuantidadeLiquida())
                .quantidadeBruta(domain.getQuantidadeBruta())
                .valor(domain.calcularValor())
                .unidadeMedida(domain.getUnidadeMedida())
                .build();
    }

    @Override
    public DMaterialUsado toDomain(MaterialUsado entity) {
        return DMaterialUsado.builder()
                .codigo(entity.getCdmaterialUsado())
                .filho(Optional.ofNullable(entity.getFilho())
                        .map(filho -> new DFilho(
                                filho.getCdfilho(),
                                filho.getDescricao(),
                                corDomainToEntityAdapter.toDomain(entity.getFilho().getCor()),
                                medidasDomainToEntityAdapter.toDomain(entity.getFilho().getMedidas())
                                )) // para não gerar stackoverflow
                        .orElse(null))
                .material(Optional.ofNullable(entity.getMaterial())
                        .map(material -> materialDomainToEntityAdapter.toDomain(material))
                        .orElse(null))
                .quantidadeLiquida(entity.getQuantidadeLiquida())
                .quantidadeBruta(entity.getQuantidadeBruta())
                .valor(entity.getValor())
                .unidadeMedida(entity.getUnidadeMedida())
                .situacao(Optional.ofNullable(entity.getSituacao())
                        .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                        .orElse(null))
                .build();
    }
}
