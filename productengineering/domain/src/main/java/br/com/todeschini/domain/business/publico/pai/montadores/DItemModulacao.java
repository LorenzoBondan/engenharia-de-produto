package br.com.todeschini.domain.business.publico.pai.montadores;

import br.com.todeschini.domain.business.publico.maquina.DMaquina;
import br.com.todeschini.domain.business.publico.medidas.DMedidas;
import br.com.todeschini.domain.business.publico.pai.DPai;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.domain.validation.NamedValidator;
import br.com.todeschini.domain.validation.ValidationBuilder;
import br.com.todeschini.domain.validation.impl.ObjetoNaoNuloValidator;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DItemModulacao {

    private DPai pai;
    private DMedidas medidas;
    private List<DMaquina> maquinas = new ArrayList<>();

    public void validar() throws ValidationException {
        new ValidationBuilder()
                .add(new NamedValidator<>("Pai", new ObjetoNaoNuloValidator()), this.pai)
                .add(new NamedValidator<>("Medidas", new ObjetoNaoNuloValidator()), this.medidas)
                .validate();
        pai.validar();
        medidas.validar();
    }
}
