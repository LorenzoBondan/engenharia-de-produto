package br.com.todeschini.persistence.publico.material;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.publico.material.DMaterial;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.enums.TipoMaterialEnum;
import br.com.todeschini.persistence.entities.publico.Cor;
import br.com.todeschini.persistence.entities.publico.Material;
import br.com.todeschini.persistence.publico.cor.CorDomainToEntityAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@EntityAdapter(entityClass = Material.class)
public class MaterialDomainToEntityAdapter implements Convertable<Material, DMaterial> {

    @Autowired
    private CorDomainToEntityAdapter corDomainToEntityAdapter;

    @Override
    public Material toEntity(DMaterial domain) {
        return Material.builder()
                .cdmaterial(domain.getCodigo())
                .descricao(domain.getDescricao())
                .tipoMaterial(Optional.ofNullable(domain.getTipoMaterial())
                        .map(tipoMaterial -> TipoMaterialEnum.valueOf(tipoMaterial.name()))
                        .orElse(null))
                .implantacao(domain.getImplantacao())
                .porcentagemPerda(domain.getPorcentagemPerda())
                .valor(domain.getValor())
                .cor(Optional.ofNullable(domain.getCor())
                        .map(cor -> new Cor(cor.getCodigo()))
                        .orElse(null))
                .build();
    }

    @Override
    public DMaterial toDomain(Material entity) {
        return DMaterial.builder()
                .codigo(entity.getCdmaterial())
                .descricao(entity.getDescricao())
                .tipoMaterial(Optional.ofNullable(entity.getTipoMaterial())
                        .map(tipoMaterial -> DTipoMaterialEnum.valueOf(tipoMaterial.name()))
                        .orElse(null))
                .implantacao(entity.getImplantacao())
                .porcentagemPerda(entity.getPorcentagemPerda())
                .valor(entity.getValor())
                .cor(Optional.ofNullable(entity.getCor())
                        .map(cor -> corDomainToEntityAdapter.toDomain(entity.getCor()))
                        .orElse(null))
                .situacao(Optional.ofNullable(entity.getSituacao())
                        .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                        .orElse(null))
                .build();
    }
}
