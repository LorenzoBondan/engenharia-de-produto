package br.com.todeschini.persistence.publico.cor;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.cor.DCor;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.publico.Cor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@EntityAdapter(entityClass = Cor.class)
public class CorDomainToEntityAdapter implements Convertable<Cor, DCor> {

    @Override
    public Cor toEntity(DCor domain) {
        return Cor.builder()
                .cdcor(domain.getCodigo())
                .descricao(domain.getDescricao())
                .hexa(domain.getHexa())
                .build();
    }

    @Override
    public DCor toDomain(Cor entity) {
        return DCor.builder()
                .codigo(entity.getCdcor())
                .descricao(entity.getDescricao())
                .hexa(entity.getHexa())
                .situacao(Optional.ofNullable(entity.getSituacao())
                        .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                        .orElse(null))
                .build();
    }
}
