package br.com.todeschini.domain.business.publico.pintura;

import br.com.todeschini.domain.Descritivel;
import br.com.todeschini.domain.business.enums.DTipoPinturaEnum;
import br.com.todeschini.domain.business.publico.material.DMaterial;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.domain.metadata.BatchEditable;
import br.com.todeschini.domain.metadata.Domain;
import br.com.todeschini.domain.validation.NamedValidator;
import br.com.todeschini.domain.validation.ValidationBuilder;
import br.com.todeschini.domain.validation.impl.ObjetoNaoNuloValidator;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Domain
public class DPintura extends DMaterial implements Descritivel  {

    @BatchEditable
    private DTipoPinturaEnum tipoPintura;

    public DPintura(Integer codigo){
        this.setCodigo(codigo);
    }

    @Override
    public void validar() throws ValidationException {
        super.validar();
        new ValidationBuilder()
                .add(new NamedValidator<>("Tipo pintura", new ObjetoNaoNuloValidator()), this.tipoPintura)
                .validate();
    }

    @Override
    public String getDescricao() {
        return super.getDescricao();
    }
}
