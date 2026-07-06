package br.com.todeschini.domain.business.publico.modelo;

import br.com.todeschini.domain.Descritivel;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.domain.metadata.Domain;
import br.com.todeschini.domain.validation.NamedValidator;
import br.com.todeschini.domain.validation.ValidationBuilder;
import br.com.todeschini.domain.validation.impl.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Domain
public class DModelo implements Descritivel {

    @EqualsAndHashCode.Include
    private Integer codigo;
    private String descricao;
    private DSituacaoEnum situacao;

    public DModelo(Integer codigo){
        this.codigo = codigo;
    }

    public void validar() throws ValidationException {
        new ValidationBuilder()
                .add(new NamedValidator<>("Descrição", new ObjetoNaoNuloValidator()), this.descricao)
                .add(new NamedValidator<>("Descrição", new NaoBrancoValidator()), this.descricao)
                .add(new NamedValidator<>("Descrição", new CaracteresEspeciaisValidator()), this.descricao)
                .add(new NamedValidator<>("Descrição", new TamanhoMinimoValidator(3)), this.descricao)
                .add(new NamedValidator<>("Descrição", new TamanhoMaximoValidator(50)), this.descricao)
                .validate();
    }

    @Override
    public String getDescricao() {
        return this.descricao;
    }
}
