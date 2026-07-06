package br.com.todeschini.domain.business.publico.materialusado;

import br.com.todeschini.domain.Descritivel;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.material.DMaterial;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.domain.metadata.BatchEditable;
import br.com.todeschini.domain.metadata.Domain;
import br.com.todeschini.domain.util.FormatadorNumeros;
import br.com.todeschini.domain.validation.NamedValidator;
import br.com.todeschini.domain.validation.ValidationBuilder;
import br.com.todeschini.domain.validation.impl.NumeroMaiorOuIgualAZeroValidator;
import br.com.todeschini.domain.validation.impl.ObjetoNaoNuloValidator;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Domain
public class DMaterialUsado implements Descritivel {

    @EqualsAndHashCode.Include
    private Integer codigo;
    @BatchEditable
    private DFilho filho;
    @BatchEditable
    private DMaterial material;
    @BatchEditable
    private Double valor;
    @BatchEditable
    private Double quantidadeLiquida;
    @BatchEditable
    private Double quantidadeBruta;
    @BatchEditable
    private String unidadeMedida;
    private DSituacaoEnum situacao;

    public DMaterialUsado(Integer codigo){
        this.codigo = codigo;
    }

    public void validar() throws ValidationException {
        new ValidationBuilder()
                .add(new NamedValidator<>("Filho", new ObjetoNaoNuloValidator()), this.filho)
                .add(new NamedValidator<>("Material", new ObjetoNaoNuloValidator()), this.material)
                .add(new NamedValidator<>("Valor", new NumeroMaiorOuIgualAZeroValidator()), this.valor)
                .add(new NamedValidator<>("Quantidade Líquida", new ObjetoNaoNuloValidator()), this.quantidadeLiquida)
                .add(new NamedValidator<>("Quantidade Líquida", new NumeroMaiorOuIgualAZeroValidator()), this.quantidadeLiquida)
                .add(new NamedValidator<>("Quantidade Bruta", new ObjetoNaoNuloValidator()), this.quantidadeBruta)
                .add(new NamedValidator<>("Quantidade Bruta", new NumeroMaiorOuIgualAZeroValidator()), this.quantidadeBruta)
                .validate();
    }

    @Override
    public String getDescricao() {
        return null;
    }

    public Double calcularQuantidadeLiquida(){
        return quantidadeLiquida;
    }

    public void calcularQuantidadeBruta(){
        double quantidadeBruta = quantidadeLiquida / (1.0 - this.getMaterial().getPorcentagemPerda() / 100);
        this.setQuantidadeBruta(FormatadorNumeros.formatarQuantidade(quantidadeBruta));
    }

    public Double calcularValor(){
        return FormatadorNumeros.formatarValor(this.getMaterial().getValor() * quantidadeLiquida);
    }
}
