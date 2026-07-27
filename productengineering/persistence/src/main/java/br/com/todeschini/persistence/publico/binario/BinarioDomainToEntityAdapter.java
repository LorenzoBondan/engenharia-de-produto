package br.com.todeschini.persistence.publico.binario;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.binario.DBinario;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.publico.Binario;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@EntityAdapter(entityClass = Binario.class)
public class BinarioDomainToEntityAdapter implements Convertable<Binario, DBinario> {

    @Override
    public Binario toEntity(DBinario domain) {
        return Binario.builder()
                .cdbinario(domain.getCodigo())
                .bytes(domain.getBytes())
                .build();
    }

    @Override
    public DBinario toDomain(Binario entity) {
        return DBinario.builder()
                .codigo(entity.getCdbinario())
                .bytes(entity.getBytes())
                .situacao(Optional.ofNullable(entity.getSituacao())
                        .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                        .orElse(null))
                .build();
    }
}
