package br.com.todeschini.persistence.publico.poliester;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.publico.poliester.DPoliester;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.enums.TipoMaterialEnum;
import br.com.todeschini.persistence.entities.publico.Cor;
import br.com.todeschini.persistence.entities.publico.Poliester;
import br.com.todeschini.persistence.publico.cor.CorDomainToEntityAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@EntityAdapter(entityClass = Poliester.class)
public class PoliesterDomainToEntityAdapter implements Convertable<Poliester, DPoliester> {

    @Autowired
    private CorDomainToEntityAdapter corDomainToEntityAdapter;

    @Override
    public Poliester toEntity(DPoliester domain) {
        Poliester Poliester = new Poliester();
        Poliester.setCdmaterial(domain.getCodigo());
        Poliester.setDescricao(domain.getDescricao());
        Poliester.setTipoMaterial(TipoMaterialEnum.valueOf(domain.getTipoMaterial().name()));
        Poliester.setImplantacao(domain.getImplantacao());
        Poliester.setPorcentagemPerda(domain.getPorcentagemPerda());
        Poliester.setValor(domain.getValor());
        Poliester.setCor(Optional.ofNullable(domain.getCor())
                .map(cor -> new Cor(cor.getCodigo()))
                .orElse(null));
        return Poliester;
    }

    @Override
    public DPoliester toDomain(Poliester entity) {
        DPoliester Poliester = new DPoliester();
        Poliester.setCodigo(entity.getCdmaterial());
        Poliester.setDescricao(entity.getDescricao());
        Poliester.setTipoMaterial(Optional.ofNullable(entity.getTipoMaterial())
                .map(tipoMaterial -> DTipoMaterialEnum.valueOf(entity.getTipoMaterial().name()))
                .orElse(null));
        Poliester.setImplantacao(entity.getImplantacao());
        Poliester.setPorcentagemPerda(entity.getPorcentagemPerda());
        Poliester.setValor(entity.getValor());
        Poliester.setCor(Optional.ofNullable(entity.getCor())
                .map(cor -> corDomainToEntityAdapter.toDomain(cor))
                .orElse(null));
        Poliester.setSituacao(Optional.ofNullable(entity.getSituacao())
                .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                .orElse(null));
        return Poliester;
    }
}
