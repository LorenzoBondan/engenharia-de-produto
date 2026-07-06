package br.com.todeschini.domain.business.publico.material;

import br.com.todeschini.domain.Descritivel;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.publico.cor.DCor;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.domain.metadata.BatchEditable;
import br.com.todeschini.domain.metadata.Domain;
import br.com.todeschini.domain.validation.NamedValidator;
import br.com.todeschini.domain.validation.ValidationBuilder;
import br.com.todeschini.domain.validation.impl.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Domain
public class DMaterial implements Descritivel {

    @EqualsAndHashCode.Include
    private Integer codigo;
    private String descricao;
    @BatchEditable
    private DTipoMaterialEnum tipoMaterial;
    @BatchEditable
    private LocalDate implantacao;
    @BatchEditable
    private Double porcentagemPerda;
    @BatchEditable
    private Double valor;
    @BatchEditable
    private DCor cor;
    private DSituacaoEnum situacao;

    public DMaterial(Integer codigo){
        this.codigo = codigo;
    }

    public void validar() throws ValidationException {
        new ValidationBuilder()
                .add(new NamedValidator<>("Descrição", new ObjetoNaoNuloValidator()), this.descricao)
                .add(new NamedValidator<>("Descrição", new NaoBrancoValidator()), this.descricao)
                .add(new NamedValidator<>("Descrição", new CaracteresEspeciaisValidator()), this.descricao)
                .add(new NamedValidator<>("Descrição", new TamanhoMinimoValidator(3)), this.descricao)
                .add(new NamedValidator<>("Descrição", new TamanhoMaximoValidator(50)), this.descricao)
                .add(new NamedValidator<>("Tipo material", new ObjetoNaoNuloValidator()), this.tipoMaterial)
                //.add(new NamedValidator<>("Implantação", new DataFuturaValidator()), this.implantacao)
                .add(new NamedValidator<>("Porcentagem de perda", new ObjetoNaoNuloValidator()), this.porcentagemPerda)
                .add(new NamedValidator<>("Porcentagem de perda", new NumeroMaiorOuIgualAZeroValidator()), this.porcentagemPerda)
                .add(new NamedValidator<>("Valor", new ObjetoNaoNuloValidator()), this.valor)
                .add(new NamedValidator<>("Valor", new NumeroMaiorOuIgualAZeroValidator()), this.valor)
                .validate();
    }

    @Override
    public String getDescricao() {
        return this.descricao;
    }
}
