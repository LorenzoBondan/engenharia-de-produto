package br.com.todeschini.persistence.publico.filho;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.enums.DTipoFilhoEnum;
import br.com.todeschini.domain.business.enums.DTipoPinturaEnum;
import br.com.todeschini.domain.business.publico.acessoriousado.DAcessorioUsado;
import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;
import br.com.todeschini.domain.business.publico.pai.DPai;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.enums.TipoFilhoEnum;
import br.com.todeschini.persistence.entities.enums.TipoPinturaEnum;
import br.com.todeschini.persistence.entities.publico.AcessorioUsado;
import br.com.todeschini.persistence.entities.publico.Filho;
import br.com.todeschini.persistence.entities.publico.MaterialUsado;
import br.com.todeschini.persistence.entities.publico.Pai;
import br.com.todeschini.persistence.publico.acessoriousado.AcessorioUsadoDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.categoriacomponente.CategoriaComponenteDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.cor.CorDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.materialusado.MaterialUsadoDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.medidas.MedidasDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.modelo.ModeloDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.roteiro.RoteiroDomainToEntityAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
@EntityAdapter(entityClass = Filho.class)
public class FilhoDomainToEntityAdapter implements Convertable<Filho, DFilho> {

    @Autowired
    private CorDomainToEntityAdapter corDomainToEntityAdapter;
    @Autowired
    private MedidasDomainToEntityAdapter medidasDomainToEntityAdapter;
    @Autowired
    private RoteiroDomainToEntityAdapter roteiroDomainToEntityAdapter;
    @Autowired
    private MaterialUsadoDomainToEntityAdapter materialUsadoDomainToEntityAdapter;
    @Autowired
    private AcessorioUsadoDomainToEntityAdapter acessorioUsadoDomainToEntityAdapter;
    @Autowired
    private CategoriaComponenteDomainToEntityAdapter categoriaComponenteDomainToEntityAdapter;
    @Autowired
    private ModeloDomainToEntityAdapter modeloDomainToEntityAdapter;

    @Override
    public Filho toEntity(DFilho domain) {

        Set<Filho> filhos = Optional.ofNullable(domain.getFilhos())
                .map(lista -> lista.stream()
                        .map(this::toEntity)
                        .collect(Collectors.toSet())
                )
                .orElse(new HashSet<>());

        List<MaterialUsado> materiaisUsados = Optional.ofNullable(domain.getMateriaisUsados())
                .map(lista -> lista.stream()
                        .map(materialUsado -> materialUsadoDomainToEntityAdapter.toEntity(materialUsado))
                        .collect(Collectors.toList())
                )
                .orElse(new ArrayList<>());

        List<AcessorioUsado> acessoriosUsados = Optional.ofNullable(domain.getAcessoriosUsados())
                .map(lista -> lista.stream()
                        .map(acessorioUsado -> acessorioUsadoDomainToEntityAdapter.toEntity(acessorioUsado))
                        .collect(Collectors.toList())
                )
                .orElse(new ArrayList<>());

        return Filho.builder()
                .cdfilho(domain.getCodigo())
                .descricao(domain.getDescricao())
                .pai(Optional.ofNullable(domain.getPai())
                        .map(pai -> new Pai( // criar objeto na mão para ter acesso aos atributos no criar estrutura. não injetar o adaptador (geraria stackoverflow)
                                pai.getCodigo(),
                                Optional.ofNullable(pai.getModelo())
                                        .map(modelo -> modeloDomainToEntityAdapter.toEntity(modelo))
                                        .orElse(null),
                                Optional.ofNullable(pai.getCategoriaComponente())
                                        .map(categoriaComponente -> categoriaComponenteDomainToEntityAdapter.toEntity(categoriaComponente))
                                        .orElse(null),
                                pai.getDescricao(),

                                pai.getBordasComprimento(),
                                pai.getBordasLargura(),

                                pai.getNumeroCantoneiras(),
                                pai.getTntUmaFace(),
                                pai.getPlasticoAcima(),
                                pai.getPlasticoAdicional(),
                                pai.getLarguraPlastico(),

                                pai.getFaces(),
                                pai.getEspecial(),
                                Optional.ofNullable(pai.getTipoPintura())
                                        .map(tipoPintura -> TipoPinturaEnum.valueOf(tipoPintura.name()))
                                        .orElse(null),
                            null
                                ))
                        .orElse(null))
                .cor(Optional.ofNullable(domain.getCor())
                        .map(cor -> corDomainToEntityAdapter.toEntity(domain.getCor()))
                        .orElse(null))
                .medidas(Optional.ofNullable(domain.getMedidas())
                        .map(medidas -> medidasDomainToEntityAdapter.toEntity(domain.getMedidas()))
                        .orElse(null))
                .roteiro(Optional.ofNullable(domain.getRoteiro())
                        .map(roteiro -> roteiroDomainToEntityAdapter.toEntity(domain.getRoteiro()))
                        .orElse(null))
                .unidadeMedida(Optional.ofNullable(domain.getUnidadeMedida()).orElse("UN"))
                .implantacao(domain.getImplantacao())
                .valor(domain.calcularValor())
                .tipo(TipoFilhoEnum.valueOf(domain.getTipo().name()))

                .filhos(filhos)
                .materiaisUsados(materiaisUsados)
                .acessoriosUsados(acessoriosUsados)

                .build();
    }

    @Override
    public DFilho toDomain(Filho entity) {

        List<DFilho> filhos = Optional.ofNullable(entity.getFilhos())
                .map(lista -> lista.stream()
                        .map(this::toDomain)
                        .collect(Collectors.toList())
                )
                .orElse(new ArrayList<>());

        List<DMaterialUsado> materiaisUsados = Optional.ofNullable(entity.getMateriaisUsados())
                .map(lista -> lista.stream()
                        .map(materialUsado -> materialUsadoDomainToEntityAdapter.toDomain(materialUsado))
                        .collect(Collectors.toList())
                )
                .orElse(new ArrayList<>());

        List<DAcessorioUsado> acessoriosUsados = Optional.ofNullable(entity.getAcessoriosUsados())
                .map(lista -> lista.stream()
                        .map(acessorioUsado -> acessorioUsadoDomainToEntityAdapter.toDomain(acessorioUsado))
                        .collect(Collectors.toList())
                )
                .orElse(new ArrayList<>());

        return DFilho.builder()
                .codigo(entity.getCdfilho())
                .descricao(entity.getDescricao())
                .pai(Optional.ofNullable(entity.getPai())
                        .map(pai -> new DPai(
                                pai.getCdpai(),
                                Optional.ofNullable(pai.getModelo())
                                        .map(modelo -> modeloDomainToEntityAdapter.toDomain(modelo))
                                        .orElse(null),
                                Optional.ofNullable(pai.getCategoriaComponente())
                                        .map(categoriaComponente -> categoriaComponenteDomainToEntityAdapter.toDomain(categoriaComponente))
                                        .orElse(null),
                                pai.getDescricao(),

                                pai.getBordasComprimento(),
                                pai.getBordasLargura(),

                                pai.getNumeroCantoneiras(),
                                pai.getTntUmaFace(),
                                pai.getPlasticoAcima(),
                                pai.getPlasticoAdicional(),
                                pai.getLarguraPlastico(),

                                pai.getFaces(),
                                pai.getEspecial(),
                                Optional.ofNullable(pai.getTipoPintura())
                                        .map(tipoPintura -> DTipoPinturaEnum.valueOf(tipoPintura.name()))
                                        .orElse(null),

                                DSituacaoEnum.valueOf(pai.getSituacao().name()),
                                null
                        ))
                        .orElse(null))
                .cor(Optional.ofNullable(entity.getCor())
                        .map(cor -> corDomainToEntityAdapter.toDomain(entity.getCor()))
                        .orElse(null))
                .medidas(Optional.ofNullable(entity.getMedidas())
                        .map(medidas -> medidasDomainToEntityAdapter.toDomain(entity.getMedidas()))
                        .orElse(null))
                .roteiro(Optional.ofNullable(entity.getRoteiro())
                        .map(roteiro -> roteiroDomainToEntityAdapter.toDomain(entity.getRoteiro()))
                        .orElse(null))
                .unidadeMedida(Optional.ofNullable(entity.getUnidadeMedida()).orElse("UN"))
                .implantacao(entity.getImplantacao())
                .valor(entity.getValor())
                .tipo(Optional.ofNullable(entity.getTipo())
                        .map(tipoFilho -> DTipoFilhoEnum.valueOf(tipoFilho.name()))
                        .orElse(null))
                .situacao(Optional.ofNullable(entity.getSituacao())
                        .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                        .orElse(null))

                .filhos(filhos)
                .materiaisUsados(materiaisUsados)
                .acessoriosUsados(acessoriosUsados)

                .build();
    }
}
