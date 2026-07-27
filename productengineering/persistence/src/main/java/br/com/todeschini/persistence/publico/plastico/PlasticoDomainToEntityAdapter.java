package br.com.todeschini.persistence.publico.plastico;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.publico.plastico.DPlastico;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.enums.TipoMaterialEnum;
import br.com.todeschini.persistence.entities.publico.Cor;
import br.com.todeschini.persistence.entities.publico.Plastico;
import br.com.todeschini.persistence.publico.cor.CorDomainToEntityAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@EntityAdapter(entityClass = Plastico.class)
public class PlasticoDomainToEntityAdapter implements Convertable<Plastico, DPlastico> {

    @Autowired
    private CorDomainToEntityAdapter corDomainToEntityAdapter;

    @Override
    public Plastico toEntity(DPlastico domain) {
        Plastico Plastico = new Plastico();
        Plastico.setCdmaterial(domain.getCodigo());
        Plastico.setDescricao(domain.getDescricao());
        Plastico.setTipoMaterial(TipoMaterialEnum.valueOf(domain.getTipoMaterial().name()));
        Plastico.setImplantacao(domain.getImplantacao());
        Plastico.setPorcentagemPerda(domain.getPorcentagemPerda());
        Plastico.setValor(domain.getValor());
        Plastico.setCor(Optional.ofNullable(domain.getCor())
                .map(cor -> new Cor(cor.getCodigo()))
                .orElse(null));
        Plastico.setGramatura(domain.getGramatura());
        return Plastico;
    }

    @Override
    public DPlastico toDomain(Plastico entity) {
        DPlastico Plastico = new DPlastico();
        Plastico.setCodigo(entity.getCdmaterial());
        Plastico.setDescricao(entity.getDescricao());
        Plastico.setTipoMaterial(Optional.ofNullable(entity.getTipoMaterial())
                .map(tipoMaterial -> DTipoMaterialEnum.valueOf(entity.getTipoMaterial().name()))
                .orElse(null));
        Plastico.setImplantacao(entity.getImplantacao());
        Plastico.setPorcentagemPerda(entity.getPorcentagemPerda());
        Plastico.setValor(entity.getValor());
        Plastico.setCor(Optional.ofNullable(entity.getCor())
                .map(cor -> corDomainToEntityAdapter.toDomain(cor))
                .orElse(null));
        Plastico.setGramatura(entity.getGramatura());
        Plastico.setSituacao(Optional.ofNullable(entity.getSituacao())
                .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                .orElse(null));
        return Plastico;
    }
}
