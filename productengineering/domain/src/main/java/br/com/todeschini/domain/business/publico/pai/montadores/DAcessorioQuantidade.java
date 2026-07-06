package br.com.todeschini.domain.business.publico.pai.montadores;

import br.com.todeschini.domain.business.publico.acessorio.DAcessorio;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.domain.validation.NamedValidator;
import br.com.todeschini.domain.validation.ValidationBuilder;
import br.com.todeschini.domain.validation.impl.NumeroMaiorQueZeroValidator;
import br.com.todeschini.domain.validation.impl.ObjetoNaoNuloValidator;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DAcessorioQuantidade {

    private DAcessorio acessorio;
    private Integer quantidade;

    public void validar() throws ValidationException {
        new ValidationBuilder()
                .add(new NamedValidator<>("Acessório", new ObjetoNaoNuloValidator()), this.acessorio)
                .add(new NamedValidator<>("Quantidade", new ObjetoNaoNuloValidator()), this.quantidade)
                .add(new NamedValidator<>("Quantidade", new NumeroMaiorQueZeroValidator()), this.quantidade)
                .validate();
        acessorio.validar();
    }
}
