package br.com.todeschini.domain.business.publico.roteiromaquina;

import br.com.todeschini.domain.Descritivel;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.maquina.DMaquina;
import br.com.todeschini.domain.business.publico.roteiro.DRoteiro;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.domain.metadata.BatchEditable;
import br.com.todeschini.domain.metadata.Domain;
import br.com.todeschini.domain.util.FormulaCalculadora;
import br.com.todeschini.domain.validation.NamedValidator;
import br.com.todeschini.domain.validation.ValidationBuilder;
import br.com.todeschini.domain.validation.impl.NumeroMaiorOuIgualAZeroValidator;
import br.com.todeschini.domain.validation.impl.ObjetoNaoNuloValidator;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Domain
public class DRoteiroMaquina implements Descritivel {

    @EqualsAndHashCode.Include
    private Integer codigo;
    @BatchEditable
    private DRoteiro roteiro;
    @BatchEditable
    private DMaquina maquina;
    @BatchEditable
    private Double tempoMaquina;
    @BatchEditable
    private Double tempoHomem;
    @BatchEditable
    private String unidadeMedida;
    private DSituacaoEnum situacao;

    public DRoteiroMaquina(Integer codigo){
        this.codigo = codigo;
    }

    public void validar() throws ValidationException {
        new ValidationBuilder()
                .add(new NamedValidator<>("Roteiro", new ObjetoNaoNuloValidator()), this.roteiro)
                .add(new NamedValidator<>("Máquina", new ObjetoNaoNuloValidator()), this.maquina)
                .add(new NamedValidator<>("Tempo máquina", new NumeroMaiorOuIgualAZeroValidator()), this.tempoMaquina)
                .add(new NamedValidator<>("Tempo homem", new NumeroMaiorOuIgualAZeroValidator()), this.tempoHomem)
                .validate();
    }

    @Override
    public String getDescricao() {
        return null;
    }

    public void calcularTempo(Integer medida1, Integer medida2, Integer medida3){
        double time = FormulaCalculadora.calcularFormulaCustomizada(
                maquina.getFormula(),
                List.of(medida1, medida2, medida3)
        );
        this.tempoMaquina = Math.round(time * 1e3) / 1e3;
        this.tempoHomem = tempoMaquina;
    }

    public Double calcularValorMaquina() {
        return Math.round(maquina.getValor() * this.tempoMaquina * 1e2) / 1e2;
    }

    public Double calcularValorHomem() {
        return Math.round(maquina.getValor() * this.tempoHomem * 1e2) / 1e2;
    }
}
