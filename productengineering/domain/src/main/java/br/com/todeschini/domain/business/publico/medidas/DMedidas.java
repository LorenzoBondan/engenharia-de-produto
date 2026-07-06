package br.com.todeschini.domain.business.publico.medidas;

import br.com.todeschini.domain.Descritivel;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.domain.metadata.BatchEditable;
import br.com.todeschini.domain.metadata.Domain;
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
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Domain
public class DMedidas implements Descritivel {

    @EqualsAndHashCode.Include
    private Integer codigo;
    @BatchEditable
    private Integer altura;
    @BatchEditable
    private Integer largura;
    @BatchEditable
    private Integer espessura;
    private DSituacaoEnum situacao;

    public DMedidas(Integer codigo){
        this.codigo = codigo;
    }

    public void validar() throws ValidationException {
        new ValidationBuilder()
                .add(new NamedValidator<>("Altura", new ObjetoNaoNuloValidator()), this.altura)
                .add(new NamedValidator<>("Altura", new NumeroMaiorQueZeroValidator()), this.altura)
                .add(new NamedValidator<>("Largura", new ObjetoNaoNuloValidator()), this.largura)
                .add(new NamedValidator<>("Largura", new NumeroMaiorQueZeroValidator()), this.largura)
                .add(new NamedValidator<>("Espessura", new ObjetoNaoNuloValidator()), this.espessura)
                .add(new NamedValidator<>("Espessura", new NumeroMaiorQueZeroValidator()), this.espessura)
                .validate();
    }

    @Override
    public String getDescricao() {
        if(this.altura != null){
            return this.altura.toString();
        }
        return null;
    }
}
