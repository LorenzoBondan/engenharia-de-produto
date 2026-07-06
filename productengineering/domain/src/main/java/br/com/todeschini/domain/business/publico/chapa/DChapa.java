package br.com.todeschini.domain.business.publico.chapa;

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
public class DChapa extends DMaterial implements Descritivel  {

    @BatchEditable
    private Integer espessura;
    @BatchEditable
    private Integer faces;

    public DChapa(Integer codigo){
        this.setCodigo(codigo);
    }

    @Override
    public void validar() throws ValidationException {
        super.validar();
        new ValidationBuilder()
                .add(new NamedValidator<>("Espessura", new ObjetoNaoNuloValidator()), this.espessura)
                .add(new NamedValidator<>("Espessura", new NumeroMaiorQueZeroValidator()), this.espessura)
                .add(new NamedValidator<>("Faces", new ObjetoNaoNuloValidator()), this.faces)
                .add(new NamedValidator<>("Faces", new NumeroMaiorQueZeroValidator()), this.faces)
                .validate();
    }

    @Override
    public String getDescricao() {
        return super.getDescricao();
    }
}
