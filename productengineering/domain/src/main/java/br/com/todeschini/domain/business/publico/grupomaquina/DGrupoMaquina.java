package br.com.todeschini.domain.business.publico.grupomaquina;

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
public class DGrupoMaquina implements Descritivel {

    @EqualsAndHashCode.Include
    private Integer codigo;
    private String nome;
    private DSituacaoEnum situacao;

    public DGrupoMaquina(Integer codigo){
        this.codigo = codigo;
    }

    public void validar() throws ValidationException {
        new ValidationBuilder()
                .add(new NamedValidator<>("Nome", new ObjetoNaoNuloValidator()), this.nome)
                .add(new NamedValidator<>("Nome", new NaoBrancoValidator()), this.nome)
                .add(new NamedValidator<>("Nome", new CaracteresEspeciaisValidator()), this.nome)
                .add(new NamedValidator<>("Nome", new TamanhoMinimoValidator(3)), this.nome)
                .add(new NamedValidator<>("Nome", new TamanhoMaximoValidator(50)), this.nome)
                .validate();
    }

    @Override
    public String getDescricao() {
        return this.nome;
    }
}
