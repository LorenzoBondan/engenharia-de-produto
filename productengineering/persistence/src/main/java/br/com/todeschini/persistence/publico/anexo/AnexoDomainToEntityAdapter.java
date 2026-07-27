package br.com.todeschini.persistence.publico.anexo;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.anexo.DAnexo;
import br.com.todeschini.domain.business.publico.binario.DBinario;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.publico.Anexo;
import br.com.todeschini.persistence.publico.binario.BinarioDomainToEntityAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@EntityAdapter(entityClass = Anexo.class)
public class AnexoDomainToEntityAdapter implements Convertable<Anexo, DAnexo> {

    @Autowired
    private BinarioDomainToEntityAdapter binarioDomainToEntityAdapter;

    @Override
    public Anexo toEntity(DAnexo domain) {
        return Anexo.builder()
                .cdanexo(domain.getCodigo())
                .binario(Optional.ofNullable(domain.getBinario())
                        .map(binario -> binarioDomainToEntityAdapter.toEntity(binario))
                        .orElse(null))
                .nome(domain.getNome())
                .mimeType(domain.getMimeType())
                .build();
    }

    @Override
    public DAnexo toDomain(Anexo entity) {
        return DAnexo.builder()
                .codigo(entity.getCdanexo())
                .binario(Optional.ofNullable(entity.getBinario())
                        .map(binario -> new DBinario(binario.getCdbinario()))
                        .orElse(null))
                .nome(entity.getNome())
                .mimeType(entity.getMimeType())
                .situacao(Optional.ofNullable(entity.getSituacao())
                        .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                        .orElse(null))
                .build();
    }
}
