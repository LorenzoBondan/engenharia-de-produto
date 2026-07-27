package br.com.todeschini.persistence.publico.roteiromaquina;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.roteiro.DRoteiro;
import br.com.todeschini.domain.business.publico.roteiromaquina.DRoteiroMaquina;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.publico.Maquina;
import br.com.todeschini.persistence.entities.publico.Roteiro;
import br.com.todeschini.persistence.entities.publico.RoteiroMaquina;
import br.com.todeschini.persistence.publico.maquina.MaquinaDomainToEntityAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@EntityAdapter(entityClass = RoteiroMaquina.class)
public class RoteiroMaquinaDomainToEntityAdapter implements Convertable<RoteiroMaquina, DRoteiroMaquina> {

    @Autowired
    private MaquinaDomainToEntityAdapter maquinaDomainToEntityAdapter;

    @Override
    public RoteiroMaquina toEntity(DRoteiroMaquina domain) {
        return RoteiroMaquina.builder()
                .cdroteiroMaquina(domain.getCodigo())
                .roteiro(new Roteiro(domain.getRoteiro().getCodigo()))
                .maquina(new Maquina(domain.getMaquina().getCodigo()))
                .tempoMaquina(domain.getTempoMaquina())
                .tempoHomem(domain.getTempoHomem())
                .unidadeMedida(Optional.ofNullable(domain.getUnidadeMedida()).orElse("MIN"))
                .build();
    }

    @Override
    public DRoteiroMaquina toDomain(RoteiroMaquina entity) {
        return DRoteiroMaquina.builder()
                .codigo(entity.getCdroteiroMaquina())
                .maquina(Optional.ofNullable(entity.getMaquina())
                        .map(maquina -> maquinaDomainToEntityAdapter.toDomain(maquina))
                        .orElse(null))
                .roteiro(Optional.ofNullable(entity.getRoteiro()) // não injetar adaptador para não gerar stackoverflow
                        .map(roteiro -> new DRoteiro(
                                roteiro.getCdroteiro(),
                                roteiro.getDescricao(),
                                roteiro.getImplantacao(),
                                roteiro.getDataFinal(),
                                roteiro.getValor(),
                                DSituacaoEnum.valueOf(roteiro.getSituacao().name())
                                ))
                        .orElse(null))
                .tempoMaquina(entity.getTempoMaquina())
                .tempoHomem(entity.getTempoHomem())
                .unidadeMedida(Optional.ofNullable(entity.getUnidadeMedida()).orElse("MIN"))
                .situacao(Optional.ofNullable(entity.getSituacao())
                        .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                        .orElse(null))
                .build();
    }
}
