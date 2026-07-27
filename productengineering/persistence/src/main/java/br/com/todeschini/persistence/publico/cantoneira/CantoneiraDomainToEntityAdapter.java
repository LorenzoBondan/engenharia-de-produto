package br.com.todeschini.persistence.publico.cantoneira;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.publico.cantoneira.DCantoneira;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.enums.TipoMaterialEnum;
import br.com.todeschini.persistence.entities.publico.Cantoneira;
import br.com.todeschini.persistence.entities.publico.Cor;
import br.com.todeschini.persistence.publico.cor.CorDomainToEntityAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@EntityAdapter(entityClass = Cantoneira.class)
public class CantoneiraDomainToEntityAdapter implements Convertable<Cantoneira, DCantoneira> {

    @Autowired
    private CorDomainToEntityAdapter corDomainToEntityAdapter;

    @Override
    public Cantoneira toEntity(DCantoneira domain) {
        Cantoneira Cantoneira = new Cantoneira();
        Cantoneira.setCdmaterial(domain.getCodigo());
        Cantoneira.setDescricao(domain.getDescricao());
        Cantoneira.setTipoMaterial(TipoMaterialEnum.valueOf(domain.getTipoMaterial().name()));
        Cantoneira.setImplantacao(domain.getImplantacao());
        Cantoneira.setPorcentagemPerda(domain.getPorcentagemPerda());
        Cantoneira.setValor(domain.getValor());
        Cantoneira.setCor(Optional.ofNullable(domain.getCor())
                .map(cor -> new Cor(cor.getCodigo()))
                .orElse(null));
        return Cantoneira;
    }

    @Override
    public DCantoneira toDomain(Cantoneira entity) {
        DCantoneira Cantoneira = new DCantoneira();
        Cantoneira.setCodigo(entity.getCdmaterial());
        Cantoneira.setDescricao(entity.getDescricao());
        Cantoneira.setTipoMaterial(Optional.ofNullable(entity.getTipoMaterial())
                .map(tipoMaterial -> DTipoMaterialEnum.valueOf(entity.getTipoMaterial().name()))
                .orElse(null));
        Cantoneira.setImplantacao(entity.getImplantacao());
        Cantoneira.setPorcentagemPerda(entity.getPorcentagemPerda());
        Cantoneira.setValor(entity.getValor());
        Cantoneira.setCor(Optional.ofNullable(entity.getCor())
                .map(cor -> corDomainToEntityAdapter.toDomain(cor))
                .orElse(null));
        Cantoneira.setSituacao(Optional.ofNullable(entity.getSituacao())
                .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                .orElse(null));
        return Cantoneira;
    }
}
