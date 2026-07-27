package br.com.todeschini.persistence.publico.polietileno;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.publico.polietileno.DPolietileno;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.enums.TipoMaterialEnum;
import br.com.todeschini.persistence.entities.publico.Cor;
import br.com.todeschini.persistence.entities.publico.Polietileno;
import br.com.todeschini.persistence.publico.cor.CorDomainToEntityAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@EntityAdapter(entityClass = Polietileno.class)
public class PolietilenoDomainToEntityAdapter implements Convertable<Polietileno, DPolietileno> {

    @Autowired
    private CorDomainToEntityAdapter corDomainToEntityAdapter;

    @Override
    public Polietileno toEntity(DPolietileno domain) {
        Polietileno Polietileno = new Polietileno();
        Polietileno.setCdmaterial(domain.getCodigo());
        Polietileno.setDescricao(domain.getDescricao());
        Polietileno.setTipoMaterial(TipoMaterialEnum.valueOf(domain.getTipoMaterial().name()));
        Polietileno.setImplantacao(domain.getImplantacao());
        Polietileno.setPorcentagemPerda(domain.getPorcentagemPerda());
        Polietileno.setValor(domain.getValor());
        Polietileno.setCor(Optional.ofNullable(domain.getCor())
                .map(cor -> new Cor(cor.getCodigo()))
                .orElse(null));
        return Polietileno;
    }

    @Override
    public DPolietileno toDomain(Polietileno entity) {
        DPolietileno Polietileno = new DPolietileno();
        Polietileno.setCodigo(entity.getCdmaterial());
        Polietileno.setDescricao(entity.getDescricao());
        Polietileno.setTipoMaterial(Optional.ofNullable(entity.getTipoMaterial())
                .map(tipoMaterial -> DTipoMaterialEnum.valueOf(entity.getTipoMaterial().name()))
                .orElse(null));
        Polietileno.setImplantacao(entity.getImplantacao());
        Polietileno.setPorcentagemPerda(entity.getPorcentagemPerda());
        Polietileno.setValor(entity.getValor());
        Polietileno.setCor(Optional.ofNullable(entity.getCor())
                .map(cor -> corDomainToEntityAdapter.toDomain(cor))
                .orElse(null));
        Polietileno.setSituacao(Optional.ofNullable(entity.getSituacao())
                .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                .orElse(null));
        return Polietileno;
    }
}
