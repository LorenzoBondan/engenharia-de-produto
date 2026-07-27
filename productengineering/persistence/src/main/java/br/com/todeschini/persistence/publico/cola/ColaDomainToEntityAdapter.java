package br.com.todeschini.persistence.publico.cola;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.publico.cola.DCola;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.enums.TipoMaterialEnum;
import br.com.todeschini.persistence.entities.publico.Cola;
import br.com.todeschini.persistence.entities.publico.Cor;
import br.com.todeschini.persistence.publico.cor.CorDomainToEntityAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@EntityAdapter(entityClass = Cola.class)
public class ColaDomainToEntityAdapter implements Convertable<Cola, DCola> {

    @Autowired
    private CorDomainToEntityAdapter corDomainToEntityAdapter;

    @Override
    public Cola toEntity(DCola domain) {
        Cola cola = new Cola();
        cola.setCdmaterial(domain.getCodigo());
        cola.setDescricao(domain.getDescricao());
        cola.setTipoMaterial(TipoMaterialEnum.valueOf(domain.getTipoMaterial().name()));
        cola.setImplantacao(domain.getImplantacao());
        cola.setPorcentagemPerda(domain.getPorcentagemPerda());
        cola.setValor(domain.getValor());
        cola.setCor(Optional.ofNullable(domain.getCor())
                .map(cor -> new Cor(cor.getCodigo()))
                .orElse(null));

        cola.setGramatura(domain.getGramatura());
        return cola;
    }

    @Override
    public DCola toDomain(Cola entity) {
        DCola cola = new DCola();
        cola.setCodigo(entity.getCdmaterial());
        cola.setDescricao(entity.getDescricao());
        cola.setTipoMaterial(Optional.ofNullable(entity.getTipoMaterial())
                .map(tipoMaterial -> DTipoMaterialEnum.valueOf(entity.getTipoMaterial().name()))
                .orElse(null));
        cola.setImplantacao(entity.getImplantacao());
        cola.setPorcentagemPerda(entity.getPorcentagemPerda());
        cola.setValor(entity.getValor());
        cola.setCor(Optional.ofNullable(entity.getCor())
                .map(cor -> corDomainToEntityAdapter.toDomain(cor))
                .orElse(null));
        cola.setGramatura(entity.getGramatura());
        cola.setSituacao(Optional.ofNullable(entity.getSituacao())
                .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                .orElse(null));
        return cola;
    }
}
