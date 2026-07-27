package br.com.todeschini.persistence.publico.roteiro;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.roteiro.DRoteiro;
import br.com.todeschini.domain.business.publico.roteiromaquina.DRoteiroMaquina;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.publico.Roteiro;
import br.com.todeschini.persistence.entities.publico.RoteiroMaquina;
import br.com.todeschini.persistence.publico.roteiromaquina.RoteiroMaquinaDomainToEntityAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@EntityAdapter(entityClass = Roteiro.class)
public class RoteiroDomainToEntityAdapter implements Convertable<Roteiro, DRoteiro> {

    @Autowired
    private RoteiroMaquinaDomainToEntityAdapter roteiroMaquinaDomainToEntityAdapter;

    @Override
    public Roteiro toEntity(DRoteiro domain) {
        List<RoteiroMaquina> roteiroMaquinas = Optional.ofNullable(domain.getRoteiroMaquinas())
                .map(lista -> lista.stream()
                        .map(roteiroMaquina -> roteiroMaquinaDomainToEntityAdapter.toEntity(roteiroMaquina))
                        .collect(Collectors.toList())
                )
                .orElse(new ArrayList<>());

        return Roteiro.builder()
                .cdroteiro(domain.getCodigo())
                .descricao(domain.getDescricao())
                .implantacao(domain.getImplantacao())
                .dataFinal(Optional.ofNullable(domain.getDataFinal()).orElse(LocalDate.of(9999,12,31)))
                .valor(domain.calcularValor())

                .roteiroMaquinas(roteiroMaquinas)

                .build();
    }

    @Override
    public DRoteiro toDomain(Roteiro entity) {

        List<DRoteiroMaquina> roteiroMaquinas = Optional.ofNullable(entity.getRoteiroMaquinas())
                .map(lista -> lista.stream()
                        .map(roteiroMaquina -> roteiroMaquinaDomainToEntityAdapter.toDomain(roteiroMaquina))
                        .collect(Collectors.toList())
                )
                .orElse(new ArrayList<>());

        return DRoteiro.builder()
                .codigo(entity.getCdroteiro())
                .descricao(entity.getDescricao())
                .implantacao(entity.getImplantacao())
                .dataFinal(Optional.ofNullable(entity.getDataFinal()).orElse(LocalDate.of(9999,12,31)))
                .valor(entity.getValor())
                .situacao(Optional.ofNullable(entity.getSituacao())
                        .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                        .orElse(null))

                .roteiroMaquinas(roteiroMaquinas)

                .build();
    }
}
