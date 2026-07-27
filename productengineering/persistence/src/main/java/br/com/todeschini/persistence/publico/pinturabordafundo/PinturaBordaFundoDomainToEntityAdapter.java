package br.com.todeschini.persistence.publico.pinturabordafundo;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.publico.pinturabordafundo.DPinturaBordaFundo;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.enums.TipoMaterialEnum;
import br.com.todeschini.persistence.entities.publico.Cor;
import br.com.todeschini.persistence.entities.publico.PinturaBordaFundo;
import br.com.todeschini.persistence.publico.cor.CorDomainToEntityAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@EntityAdapter(entityClass = PinturaBordaFundo.class)
public class PinturaBordaFundoDomainToEntityAdapter implements Convertable<PinturaBordaFundo, DPinturaBordaFundo> {

    @Autowired
    private CorDomainToEntityAdapter corDomainToEntityAdapter;

    @Override
    public PinturaBordaFundo toEntity(DPinturaBordaFundo domain) {
        PinturaBordaFundo PinturaBordaFundo = new PinturaBordaFundo();
        PinturaBordaFundo.setCdmaterial(domain.getCodigo());
        PinturaBordaFundo.setDescricao(domain.getDescricao());
        PinturaBordaFundo.setTipoMaterial(TipoMaterialEnum.valueOf(domain.getTipoMaterial().name()));
        PinturaBordaFundo.setImplantacao(domain.getImplantacao());
        PinturaBordaFundo.setPorcentagemPerda(domain.getPorcentagemPerda());
        PinturaBordaFundo.setValor(domain.getValor());
        PinturaBordaFundo.setCor(Optional.ofNullable(domain.getCor())
                .map(cor -> new Cor(cor.getCodigo()))
                .orElse(null));
        return PinturaBordaFundo;
    }

    @Override
    public DPinturaBordaFundo toDomain(PinturaBordaFundo entity) {
        DPinturaBordaFundo PinturaBordaFundo = new DPinturaBordaFundo();
        PinturaBordaFundo.setCodigo(entity.getCdmaterial());
        PinturaBordaFundo.setDescricao(entity.getDescricao());
        PinturaBordaFundo.setTipoMaterial(Optional.ofNullable(entity.getTipoMaterial())
                .map(tipoMaterial -> DTipoMaterialEnum.valueOf(entity.getTipoMaterial().name()))
                .orElse(null));
        PinturaBordaFundo.setImplantacao(entity.getImplantacao());
        PinturaBordaFundo.setPorcentagemPerda(entity.getPorcentagemPerda());
        PinturaBordaFundo.setValor(entity.getValor());
        PinturaBordaFundo.setCor(Optional.ofNullable(entity.getCor())
                .map(cor -> corDomainToEntityAdapter.toDomain(cor))
                .orElse(null));
        PinturaBordaFundo.setSituacao(Optional.ofNullable(entity.getSituacao())
                .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                .orElse(null));
        return PinturaBordaFundo;
    }
}
