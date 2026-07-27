package br.com.todeschini.persistence.publico.fitaborda;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.publico.fitaborda.DFitaBorda;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.enums.TipoMaterialEnum;
import br.com.todeschini.persistence.entities.publico.Cor;
import br.com.todeschini.persistence.entities.publico.FitaBorda;
import br.com.todeschini.persistence.publico.cor.CorDomainToEntityAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@EntityAdapter(entityClass = FitaBorda.class)
public class FitaBordaDomainToEntityAdapter implements Convertable<FitaBorda, DFitaBorda> {

    @Autowired
    private CorDomainToEntityAdapter corDomainToEntityAdapter;

    @Override
    public FitaBorda toEntity(DFitaBorda domain) {
        FitaBorda fitaBorda = new FitaBorda();
        fitaBorda.setCdmaterial(domain.getCodigo());
        fitaBorda.setDescricao(domain.getDescricao());
        fitaBorda.setTipoMaterial(TipoMaterialEnum.valueOf(domain.getTipoMaterial().name()));
        fitaBorda.setImplantacao(domain.getImplantacao());
        fitaBorda.setPorcentagemPerda(domain.getPorcentagemPerda());
        fitaBorda.setValor(domain.getValor());
        fitaBorda.setCor(Optional.ofNullable(domain.getCor())
                .map(cor -> new Cor(cor.getCodigo()))
                .orElse(null));

        fitaBorda.setEspessura(domain.getEspessura());
        fitaBorda.setAltura(domain.getAltura());
        return fitaBorda;
    }

    @Override
    public DFitaBorda toDomain(FitaBorda entity) {
        DFitaBorda fitaBorda = new DFitaBorda();
        fitaBorda.setCodigo(entity.getCdmaterial());
        fitaBorda.setDescricao(entity.getDescricao());
        fitaBorda.setTipoMaterial(Optional.ofNullable(entity.getTipoMaterial())
                .map(tipoMaterial -> DTipoMaterialEnum.valueOf(entity.getTipoMaterial().name()))
                .orElse(null));
        fitaBorda.setImplantacao(entity.getImplantacao());
        fitaBorda.setPorcentagemPerda(entity.getPorcentagemPerda());
        fitaBorda.setValor(entity.getValor());
        fitaBorda.setCor(Optional.ofNullable(entity.getCor())
                .map(cor -> corDomainToEntityAdapter.toDomain(cor))
                .orElse(null));
        fitaBorda.setEspessura(entity.getEspessura());
        fitaBorda.setAltura(entity.getAltura());
        fitaBorda.setSituacao(Optional.ofNullable(entity.getSituacao())
                .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                .orElse(null));
        return fitaBorda;
    }
}
