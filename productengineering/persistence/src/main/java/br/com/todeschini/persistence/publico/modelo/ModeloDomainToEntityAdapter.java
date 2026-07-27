package br.com.todeschini.persistence.publico.modelo;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.modelo.DModelo;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.publico.Modelo;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@EntityAdapter(entityClass = Modelo.class)
public class ModeloDomainToEntityAdapter implements Convertable<Modelo, DModelo> {

    @Override
    public Modelo toEntity(DModelo domain) {
        return Modelo.builder()
                .cdmodelo(domain.getCodigo())
                .descricao(domain.getDescricao())
                .build();
    }

    @Override
    public DModelo toDomain(Modelo entity) {
        return DModelo.builder()
                .codigo(entity.getCdmodelo())
                .descricao(entity.getDescricao())
                .situacao(Optional.ofNullable(entity.getSituacao())
                        .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                        .orElse(null))
                .build();
    }
}
