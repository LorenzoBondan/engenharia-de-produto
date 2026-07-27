package br.com.todeschini.persistence.publico.acessorio;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.acessorio.DAcessorio;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.publico.Acessorio;
import br.com.todeschini.persistence.entities.publico.Cor;
import br.com.todeschini.persistence.entities.publico.Medidas;
import br.com.todeschini.persistence.publico.cor.CorDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.medidas.MedidasDomainToEntityAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@EntityAdapter(entityClass = Acessorio.class)
public class AcessorioDomainToEntityAdapter implements Convertable<Acessorio, DAcessorio> {

    @Autowired
    private CorDomainToEntityAdapter corDomainToEntityAdapter;
    @Autowired
    private MedidasDomainToEntityAdapter medidasDomainToEntityAdapter;

    @Override
    public Acessorio toEntity(DAcessorio domain) {
        return Acessorio.builder()
                .cdacessorio(domain.getCodigo())
                .descricao(domain.getDescricao())
                .medidas(Optional.ofNullable(domain.getMedidas())
                        .map(medidas -> new Medidas(medidas.getCodigo()))
                        .orElse(null))
                .cor(Optional.ofNullable(domain.getCor())
                        .map(cor -> new Cor(cor.getCodigo()))
                        .orElse(null))
                .implantacao(domain.getImplantacao())
                .valor(domain.getValor())
                .build();
    }

    @Override
    public DAcessorio toDomain(Acessorio entity) {
        return DAcessorio.builder()
                .codigo(entity.getCdacessorio())
                .descricao(entity.getDescricao())
                .medidas(Optional.ofNullable(entity.getMedidas())
                        .map(medidasDomainToEntityAdapter::toDomain)
                        .orElse(null))
                .cor(Optional.ofNullable(entity.getCor())
                        .map(corDomainToEntityAdapter::toDomain)
                        .orElse(null))
                .implantacao(entity.getImplantacao())
                .valor(entity.getValor())
                .situacao(Optional.ofNullable(entity.getSituacao())
                        .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                        .orElse(null))
                .build();
    }
}
