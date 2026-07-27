package br.com.todeschini.persistence.publico.maquina;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.maquina.DMaquina;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.publico.GrupoMaquina;
import br.com.todeschini.persistence.entities.publico.Maquina;
import br.com.todeschini.persistence.publico.grupomaquina.GrupoMaquinaDomainToEntityAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@EntityAdapter(entityClass = Maquina.class)
public class MaquinaDomainToEntityAdapter implements Convertable<Maquina, DMaquina> {

    @Autowired
    private GrupoMaquinaDomainToEntityAdapter grupoMaquinaDomainToEntityAdapter;

    @Override
    public Maquina toEntity(DMaquina domain) {
        return Maquina.builder()
                .cdmaquina(domain.getCodigo())
                .nome(domain.getNome())
                .formula(domain.getFormula())
                .valor(domain.getValor())
                .grupoMaquina(new GrupoMaquina(domain.getGrupoMaquina().getCodigo()))
                .build();
    }

    @Override
    public DMaquina toDomain(Maquina entity) {
        return DMaquina.builder()
                .codigo(entity.getCdmaquina())
                .nome(entity.getNome())
                .formula(entity.getFormula())
                .valor(entity.getValor())
                .grupoMaquina(Optional.ofNullable(entity.getGrupoMaquina())
                        .map(grupoMaquina -> grupoMaquinaDomainToEntityAdapter.toDomain(entity.getGrupoMaquina()))
                        .orElse(null))
                .situacao(Optional.ofNullable(entity.getSituacao())
                        .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                        .orElse(null))
                .build();
    }
}
