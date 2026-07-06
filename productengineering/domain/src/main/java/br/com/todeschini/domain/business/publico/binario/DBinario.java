package br.com.todeschini.domain.business.publico.binario;

import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.domain.metadata.Domain;
import br.com.todeschini.domain.validation.NamedValidator;
import br.com.todeschini.domain.validation.ValidationBuilder;
import br.com.todeschini.domain.validation.impl.ObjetoNaoNuloValidator;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Domain
public class DBinario {

    @EqualsAndHashCode.Include
    private Integer codigo;
    private byte[] bytes;
    private DSituacaoEnum situacao;

    public DBinario(Integer codigo){
        this.codigo = codigo;
    }

    public void validar() throws ValidationException {
        new ValidationBuilder()
                .add(new NamedValidator<>("Bytes", new ObjetoNaoNuloValidator()), this.bytes)
                .validate();
    }
}
