package br.com.todeschini.persistence.publico.baguete;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.publico.baguete.DBaguete;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.enums.TipoMaterialEnum;
import br.com.todeschini.persistence.entities.publico.Baguete;
import br.com.todeschini.persistence.entities.publico.Cor;
import br.com.todeschini.persistence.publico.cor.CorDomainToEntityAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@EntityAdapter(entityClass = Baguete.class)
public class BagueteDomainToEntityAdapter implements Convertable<Baguete, DBaguete> {

    @Autowired
    private CorDomainToEntityAdapter corDomainToEntityAdapter;

    @Override
    public Baguete toEntity(DBaguete domain) {
        Baguete Baguete = new Baguete();
        Baguete.setCdmaterial(domain.getCodigo());
        Baguete.setDescricao(domain.getDescricao());
        Baguete.setTipoMaterial(TipoMaterialEnum.valueOf(domain.getTipoMaterial().name()));
        Baguete.setImplantacao(domain.getImplantacao());
        Baguete.setPorcentagemPerda(domain.getPorcentagemPerda());
        Baguete.setValor(domain.getValor());
        Baguete.setCor(Optional.ofNullable(domain.getCor())
                .map(cor -> new Cor(cor.getCodigo()))
                .orElse(null));
        return Baguete;
    }

    @Override
    public DBaguete toDomain(Baguete entity) {
        DBaguete Baguete = new DBaguete();
        Baguete.setCodigo(entity.getCdmaterial());
        Baguete.setDescricao(entity.getDescricao());
        Baguete.setTipoMaterial(Optional.ofNullable(entity.getTipoMaterial())
                .map(tipoMaterial -> DTipoMaterialEnum.valueOf(entity.getTipoMaterial().name()))
                .orElse(null));
        Baguete.setImplantacao(entity.getImplantacao());
        Baguete.setPorcentagemPerda(entity.getPorcentagemPerda());
        Baguete.setValor(entity.getValor());
        Baguete.setCor(Optional.ofNullable(entity.getCor())
                .map(cor -> corDomainToEntityAdapter.toDomain(cor))
                .orElse(null));
        Baguete.setSituacao(Optional.ofNullable(entity.getSituacao())
                .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                .orElse(null));
        return Baguete;
    }
}
