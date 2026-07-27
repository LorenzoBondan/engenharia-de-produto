package br.com.todeschini.persistence.publico.chapa;

import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.publico.chapa.DChapa;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.enums.TipoMaterialEnum;
import br.com.todeschini.persistence.entities.publico.Chapa;
import br.com.todeschini.persistence.entities.publico.Cor;
import br.com.todeschini.persistence.publico.cor.CorDomainToEntityAdapter;
import br.com.todeschini.domain.Convertable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@EntityAdapter(entityClass = Chapa.class)
public class ChapaDomainToEntityAdapter implements Convertable<Chapa, DChapa> {

    @Autowired
    private CorDomainToEntityAdapter corDomainToEntityAdapter;

    @Override
    public Chapa toEntity(DChapa domain) {
        Chapa chapa = new Chapa();
        chapa.setCdmaterial(domain.getCodigo());
        chapa.setDescricao(domain.getDescricao());
        chapa.setTipoMaterial(TipoMaterialEnum.valueOf(domain.getTipoMaterial().name()));
        chapa.setImplantacao(domain.getImplantacao());
        chapa.setPorcentagemPerda(domain.getPorcentagemPerda());
        chapa.setValor(domain.getValor());
        chapa.setCor(Optional.ofNullable(domain.getCor())
                .map(cor -> new Cor(cor.getCodigo()))
                .orElse(null));

        chapa.setEspessura(domain.getEspessura());
        chapa.setFaces(domain.getFaces());
        return chapa;
    }

    @Override
    public DChapa toDomain(Chapa entity) {
        DChapa chapa = new DChapa();
        chapa.setCodigo(entity.getCdmaterial());
        chapa.setDescricao(entity.getDescricao());
        chapa.setTipoMaterial(Optional.ofNullable(entity.getTipoMaterial())
                .map(tipoMaterial -> DTipoMaterialEnum.valueOf(entity.getTipoMaterial().name()))
                .orElse(null));
        chapa.setImplantacao(entity.getImplantacao());
        chapa.setPorcentagemPerda(entity.getPorcentagemPerda());
        chapa.setValor(entity.getValor());
        chapa.setCor(Optional.ofNullable(entity.getCor())
                .map(cor -> corDomainToEntityAdapter.toDomain(cor))
                .orElse(null));
        chapa.setEspessura(entity.getEspessura());
        chapa.setFaces(entity.getFaces());
        chapa.setSituacao(Optional.ofNullable(entity.getSituacao())
                .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                .orElse(null));
        return chapa;
    }
}
