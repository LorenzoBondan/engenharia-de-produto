package br.com.todeschini.domain.business.publico.roteiro;

import br.com.todeschini.domain.Descritivel;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.roteiromaquina.DRoteiroMaquina;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.domain.metadata.BatchEditable;
import br.com.todeschini.domain.metadata.Domain;
import br.com.todeschini.domain.validation.DataRange;
import br.com.todeschini.domain.validation.NamedValidator;
import br.com.todeschini.domain.validation.ValidationBuilder;
import br.com.todeschini.domain.validation.impl.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Domain
public class DRoteiro implements Descritivel {

    @EqualsAndHashCode.Include
    private Integer codigo;
    private String descricao;
    @BatchEditable
    private LocalDate implantacao;
    @BatchEditable
    private LocalDate dataFinal;
    @BatchEditable
    private Double valor;
    private DSituacaoEnum situacao;

    private List<DRoteiroMaquina> roteiroMaquinas = new ArrayList<>();

    public DRoteiro(Integer codigo){
        this.codigo = codigo;
    }

    public DRoteiro(Integer codigo, String descricao, LocalDate implantacao, LocalDate dataFinal, Double valor, DSituacaoEnum situacao){
        this.codigo = codigo;
        this.descricao = descricao;
        this.implantacao = implantacao;
        this.dataFinal = dataFinal;
        this.valor = valor;
        this.situacao = situacao;
    }

    public void validar() throws ValidationException {
        new ValidationBuilder()
                .add(new NamedValidator<>("Descrição", new ObjetoNaoNuloValidator()), this.descricao)
                .add(new NamedValidator<>("Descrição", new NaoBrancoValidator()), this.descricao)
                .add(new NamedValidator<>("Descrição", new CaracteresEspeciaisValidator()), this.descricao)
                .add(new NamedValidator<>("Descrição", new TamanhoMinimoValidator(3)), this.descricao)
                .add(new NamedValidator<>("Descrição", new TamanhoMaximoValidator(50)), this.descricao)
                .add(new NamedValidator<>("Implantação", new ObjetoNaoNuloValidator()), this.implantacao)
                .add(new NamedValidator<>("Implantação", new DataFuturaValidator()), this.implantacao)
                .add(new NamedValidator<>("Implantação", new DataInicialAntesDeDataFinalValidator()), new DataRange(this.implantacao, this.dataFinal))
                .add(new NamedValidator<>("Data final", new DataFuturaValidator()), this.dataFinal)
                .add(new NamedValidator<>("Valor", new NumeroMaiorOuIgualAZeroValidator()), this.valor)
                .validate();
    }

    @Override
    public String getDescricao() {
        return this.descricao;
    }

    public Double calcularValor() {
        double valor = 0;
        for(DRoteiroMaquina roteiroMaquina : this.roteiroMaquinas) {
            valor += roteiroMaquina.calcularValorMaquina();
            valor += roteiroMaquina.calcularValorMaquina();
        }
        this.valor = valor;
        return valor;
    }
}
