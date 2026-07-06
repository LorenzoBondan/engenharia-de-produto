package br.com.todeschini.domain.business.publico.baguete;

import br.com.todeschini.domain.Descritivel;
import br.com.todeschini.domain.business.publico.material.DMaterial;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.domain.metadata.Domain;
import br.com.todeschini.domain.validation.ValidationBuilder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Domain
public class DBaguete extends DMaterial implements Descritivel  {

    public DBaguete(Integer codigo){
        this.setCodigo(codigo);
    }

    @Override
    public void validar() throws ValidationException {
        super.validar();
        new ValidationBuilder()
                .validate();
    }

    @Override
    public String getDescricao() {
        return super.getDescricao();
    }
}
