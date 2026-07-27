package br.com.todeschini.persistence.publico.pintura;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.enums.DTipoPinturaEnum;
import br.com.todeschini.domain.business.publico.pintura.DPintura;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.enums.TipoMaterialEnum;
import br.com.todeschini.persistence.entities.enums.TipoPinturaEnum;
import br.com.todeschini.persistence.entities.publico.Cor;
import br.com.todeschini.persistence.entities.publico.Pintura;
import br.com.todeschini.persistence.publico.cor.CorDomainToEntityAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@EntityAdapter(entityClass = Pintura.class)
public class PinturaDomainToEntityAdapter implements Convertable<Pintura, DPintura> {

    @Autowired
    private CorDomainToEntityAdapter corDomainToEntityAdapter;

    @Override
    public Pintura toEntity(DPintura domain) {
        Pintura Pintura = new Pintura();
        Pintura.setCdmaterial(domain.getCodigo());
        Pintura.setDescricao(domain.getDescricao());
        Pintura.setTipoMaterial(TipoMaterialEnum.valueOf(domain.getTipoMaterial().name()));
        Pintura.setImplantacao(domain.getImplantacao());
        Pintura.setPorcentagemPerda(domain.getPorcentagemPerda());
        Pintura.setValor(domain.getValor());
        Pintura.setCor(Optional.ofNullable(domain.getCor())
                .map(cor -> new Cor(cor.getCodigo()))
                .orElse(null));
        Pintura.setTipoPintura(Optional.ofNullable(domain.getTipoPintura())
                .map(tipoPintura -> TipoPinturaEnum.valueOf(tipoPintura.name()))
                .orElse(null));
        return Pintura;
    }

    @Override
    public DPintura toDomain(Pintura entity) {
        DPintura Pintura = new DPintura();
        Pintura.setCodigo(entity.getCdmaterial());
        Pintura.setDescricao(entity.getDescricao());
        Pintura.setTipoMaterial(Optional.ofNullable(entity.getTipoMaterial())
                .map(tipoMaterial -> DTipoMaterialEnum.valueOf(entity.getTipoMaterial().name()))
                .orElse(null));
        Pintura.setImplantacao(entity.getImplantacao());
        Pintura.setPorcentagemPerda(entity.getPorcentagemPerda());
        Pintura.setValor(entity.getValor());
        Pintura.setCor(Optional.ofNullable(entity.getCor())
                .map(cor -> corDomainToEntityAdapter.toDomain(cor))
                .orElse(null));
        Pintura.setTipoPintura(Optional.ofNullable(entity.getTipoPintura())
                .map(tipoPintura -> DTipoPinturaEnum.valueOf(tipoPintura.name()))
                .orElse(null));
        Pintura.setSituacao(Optional.ofNullable(entity.getSituacao())
                .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                .orElse(null));
        return Pintura;
    }
}
