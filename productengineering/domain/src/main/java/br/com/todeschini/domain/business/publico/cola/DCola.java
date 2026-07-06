package br.com.todeschini.domain.business.publico.cola;

import br.com.todeschini.domain.Descritivel;
import br.com.todeschini.domain.business.publico.material.DMaterial;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.domain.metadata.BatchEditable;
import br.com.todeschini.domain.metadata.Domain;
import br.com.todeschini.domain.validation.NamedValidator;
import br.com.todeschini.domain.validation.ValidationBuilder;
import br.com.todeschini.domain.validation.impl.NumeroMaiorQueZeroValidator;
import br.com.todeschini.domain.validation.impl.ObjetoNaoNuloValidator;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Domain
public class DCola extends DMaterial implements Descritivel  {

    @BatchEditable
    private Double gramatura;

    public DCola(Integer codigo){
        this.setCodigo(codigo);
    }

    @Override
    public void validar() throws ValidationException {
        super.validar();
        new ValidationBuilder()
                .add(new NamedValidator<>("Gramatura", new ObjetoNaoNuloValidator()), this.gramatura)
                .add(new NamedValidator<>("Gramatura", new NumeroMaiorQueZeroValidator()), this.gramatura)
                .validate();
    }

    @Override
    public String getDescricao() {
        return super.getDescricao();
    }
}
