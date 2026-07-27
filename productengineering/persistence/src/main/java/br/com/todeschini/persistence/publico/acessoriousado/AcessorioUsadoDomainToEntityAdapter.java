package br.com.todeschini.persistence.publico.acessoriousado;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.acessoriousado.DAcessorioUsado;
import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.publico.AcessorioUsado;
import br.com.todeschini.persistence.entities.publico.Filho;
import br.com.todeschini.persistence.publico.acessorio.AcessorioDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.cor.CorDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.medidas.MedidasDomainToEntityAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@EntityAdapter(entityClass = AcessorioUsado.class)
public class AcessorioUsadoDomainToEntityAdapter implements Convertable<AcessorioUsado, DAcessorioUsado> {

    @Autowired
    private AcessorioDomainToEntityAdapter acessorioDomainToEntityAdapter;
    @Autowired
    private CorDomainToEntityAdapter corDomainToEntityAdapter;
    @Autowired
    private MedidasDomainToEntityAdapter medidasDomainToEntityAdapter;

    @Override
    public AcessorioUsado toEntity(DAcessorioUsado domain) {
        return AcessorioUsado.builder()
                .cdacessorioUsado(domain.getCodigo())
                .acessorio(Optional.ofNullable(domain.getAcessorio())
                        .map(acessorioDomainToEntityAdapter::toEntity)
                        .orElse(null))
                .filho(Optional.ofNullable(domain.getFilho())
                        .map(filho -> new Filho(filho.getCodigo()))
                        .orElse(null))
                .quantidade(domain.getQuantidade())
                .valor(domain.getValor())
                .unidadeMedida(Optional.ofNullable(domain.getUnidadeMedida()).orElse("UN"))
                .build();
    }

    @Override
    public DAcessorioUsado toDomain(AcessorioUsado entity) {
        return DAcessorioUsado.builder()
                .codigo(entity.getCdacessorioUsado())
                .acessorio(Optional.ofNullable(entity.getAcessorio())
                        .map(acessorioDomainToEntityAdapter::toDomain)
                        .orElse(null))
                .filho(Optional.ofNullable(entity.getFilho())
                        .map(filho -> new DFilho(
                                filho.getCdfilho(),
                                filho.getDescricao(),
                                Optional.ofNullable(filho.getCor())
                                        .map(corDomainToEntityAdapter::toDomain)
                                        .orElse(null),
                                Optional.ofNullable(filho.getMedidas())
                                        .map(medidasDomainToEntityAdapter::toDomain)
                                        .orElse(null)
                        )) // para não gerar stackoverflow
                        .orElse(null))
                .quantidade(entity.getQuantidade())
                .valor(entity.getValor())
                .unidadeMedida(Optional.ofNullable(entity.getUnidadeMedida()).orElse("UN"))
                .situacao(Optional.ofNullable(entity.getSituacao())
                        .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                        .orElse(null))
                .build();
    }
}