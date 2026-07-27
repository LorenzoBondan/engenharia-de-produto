package br.com.todeschini.persistence.publico.tnt;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.publico.tnt.DTnt;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.enums.TipoMaterialEnum;
import br.com.todeschini.persistence.entities.publico.Cor;
import br.com.todeschini.persistence.entities.publico.Tnt;
import br.com.todeschini.persistence.publico.cor.CorDomainToEntityAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@EntityAdapter(entityClass = Tnt.class)
public class TntDomainToEntityAdapter implements Convertable<Tnt, DTnt> {

    @Autowired
    private CorDomainToEntityAdapter corDomainToEntityAdapter;

    @Override
    public Tnt toEntity(DTnt domain) {
        Tnt Tnt = new Tnt();
        Tnt.setCdmaterial(domain.getCodigo());
        Tnt.setDescricao(domain.getDescricao());
        Tnt.setTipoMaterial(TipoMaterialEnum.valueOf(domain.getTipoMaterial().name()));
        Tnt.setImplantacao(domain.getImplantacao());
        Tnt.setPorcentagemPerda(domain.getPorcentagemPerda());
        Tnt.setValor(domain.getValor());
        Tnt.setCor(Optional.ofNullable(domain.getCor())
                .map(cor -> new Cor(cor.getCodigo()))
                .orElse(null));
        return Tnt;
    }

    @Override
    public DTnt toDomain(Tnt entity) {
        DTnt Tnt = new DTnt();
        Tnt.setCodigo(entity.getCdmaterial());
        Tnt.setDescricao(entity.getDescricao());
        Tnt.setTipoMaterial(Optional.ofNullable(entity.getTipoMaterial())
                .map(tipoMaterial -> DTipoMaterialEnum.valueOf(entity.getTipoMaterial().name()))
                .orElse(null));
        Tnt.setImplantacao(entity.getImplantacao());
        Tnt.setPorcentagemPerda(entity.getPorcentagemPerda());
        Tnt.setValor(entity.getValor());
        Tnt.setCor(Optional.ofNullable(entity.getCor())
                .map(cor -> corDomainToEntityAdapter.toDomain(cor))
                .orElse(null));
        Tnt.setSituacao(Optional.ofNullable(entity.getSituacao())
                .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                .orElse(null));
        return Tnt;
    }
}
