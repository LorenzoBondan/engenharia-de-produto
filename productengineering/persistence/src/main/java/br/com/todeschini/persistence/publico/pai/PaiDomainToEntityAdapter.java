package br.com.todeschini.persistence.publico.pai;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.enums.DTipoPinturaEnum;
import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.pai.DPai;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.enums.TipoPinturaEnum;
import br.com.todeschini.persistence.entities.publico.CategoriaComponente;
import br.com.todeschini.persistence.entities.publico.Filho;
import br.com.todeschini.persistence.entities.publico.Modelo;
import br.com.todeschini.persistence.entities.publico.Pai;
import br.com.todeschini.persistence.publico.categoriacomponente.CategoriaComponenteDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.filho.FilhoDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.modelo.ModeloDomainToEntityAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@EntityAdapter(entityClass = Pai.class)
public class PaiDomainToEntityAdapter implements Convertable<Pai, DPai> {

    @Autowired
    private FilhoDomainToEntityAdapter filhoDomainToEntityAdapter;
    @Autowired
    private ModeloDomainToEntityAdapter modeloDomainToEntityAdapter;
    @Autowired
    private CategoriaComponenteDomainToEntityAdapter categoriaComponenteDomainToEntityAdapter;

    @Override
    public Pai toEntity(DPai domain) {

        List<Filho> filhos = Optional.ofNullable(domain.getFilhos())
                .map(lista -> lista.stream()
                        .map(filho -> filhoDomainToEntityAdapter.toEntity(filho))
                        .collect(Collectors.toList())
                )
                .orElse(new ArrayList<>());

        return Pai.builder()
                .cdpai(domain.getCodigo())
                .modelo(new Modelo(domain.getModelo().getCodigo()))
                .categoriaComponente(new CategoriaComponente(domain.getCategoriaComponente().getCodigo()))
                .descricao(domain.getDescricao())
                .bordasComprimento(domain.getBordasComprimento())
                .bordasLargura(domain.getBordasLargura())
                .numeroCantoneiras(Optional.ofNullable(domain.getNumeroCantoneiras())
                        .orElse(4))
                .tntUmaFace(domain.getTntUmaFace())
                .plasticoAcima(domain.getPlasticoAcima())
                .plasticoAdicional(domain.getPlasticoAdicional())
                .larguraPlastico(domain.getLarguraPlastico())
                .faces(domain.getFaces())
                .especial(domain.getEspecial())
                .tipoPintura(Optional.ofNullable(domain.getTipoPintura())
                        .map(tipoPintura -> TipoPinturaEnum.valueOf(tipoPintura.name()))
                        .orElse(null))

                .filhos(filhos)

                .build();
    }

    @Override
    public DPai toDomain(Pai entity) {

        List<DFilho> filhos = Optional.ofNullable(entity.getFilhos())
                .map(lista -> lista.stream()
                        .map(filho -> filhoDomainToEntityAdapter.toDomain(filho))
                        .collect(Collectors.toList())
                )
                .orElse(new ArrayList<>());

        return DPai.builder()
                .codigo(entity.getCdpai())
                .modelo(Optional.ofNullable(entity.getModelo())
                        .map(modelo -> modeloDomainToEntityAdapter.toDomain(modelo))
                        .orElse(null))
                .categoriaComponente(Optional.ofNullable(entity.getCategoriaComponente())
                        .map(categoriaComponente-> categoriaComponenteDomainToEntityAdapter.toDomain(categoriaComponente))
                        .orElse(null))
                .descricao(entity.getDescricao())
                .bordasComprimento(entity.getBordasComprimento())
                .bordasLargura(entity.getBordasLargura())
                .numeroCantoneiras(Optional.ofNullable(entity.getNumeroCantoneiras())
                        .orElse(4))
                .tntUmaFace(entity.getTntUmaFace())
                .plasticoAcima(entity.getPlasticoAcima())
                .plasticoAdicional(entity.getPlasticoAdicional())
                .larguraPlastico(entity.getLarguraPlastico())
                .faces(entity.getFaces())
                .especial(entity.getEspecial())
                .tipoPintura(Optional.ofNullable(entity.getTipoPintura())
                        .map(tipoPintura -> DTipoPinturaEnum.valueOf(tipoPintura.name()))
                        .orElse(null))
                .situacao(Optional.ofNullable(entity.getSituacao())
                        .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                        .orElse(null))

                .filhos(filhos)

                .build();
    }
}
