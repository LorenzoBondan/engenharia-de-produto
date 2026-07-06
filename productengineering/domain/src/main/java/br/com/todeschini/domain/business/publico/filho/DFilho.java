package br.com.todeschini.domain.business.publico.filho;

import br.com.todeschini.domain.Descritivel;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.enums.DTipoFilhoEnum;
import br.com.todeschini.domain.business.publico.acessoriousado.DAcessorioUsado;
import br.com.todeschini.domain.business.publico.cor.DCor;
import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;
import br.com.todeschini.domain.business.publico.medidas.DMedidas;
import br.com.todeschini.domain.business.publico.pai.DPai;
import br.com.todeschini.domain.business.publico.roteiro.DRoteiro;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.domain.metadata.BatchEditable;
import br.com.todeschini.domain.metadata.Domain;
import br.com.todeschini.domain.util.FormatadorNumeros;
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
public class DFilho implements Descritivel {

    @EqualsAndHashCode.Include
    private Integer codigo;
    private String descricao;
    @BatchEditable
    private DPai pai;
    @BatchEditable
    private DCor cor;
    @BatchEditable
    private DMedidas medidas;
    @BatchEditable
    private DRoteiro roteiro;
    @BatchEditable
    private String unidadeMedida;
    @BatchEditable
    private LocalDate implantacao;
    @BatchEditable
    private Double valor;
    @BatchEditable
    private DTipoFilhoEnum tipo;
    private DSituacaoEnum situacao;

    private List<DFilho> filhos = new ArrayList<>();
    private List<DMaterialUsado> materiaisUsados = new ArrayList<>();
    private List<DAcessorioUsado> acessoriosUsados = new ArrayList<>();

    public DFilho(Integer codigo){
        this.codigo = codigo;
    }

    public DFilho(Integer codigo, String descricao, DCor cor, DMedidas medidas){
        this.codigo = codigo;
        this.descricao = descricao;
        this.cor = cor;
        this.medidas = medidas;
    }

    public void validar() throws ValidationException {
        new ValidationBuilder()
                .add(new NamedValidator<>("Descrição", new ObjetoNaoNuloValidator()), this.descricao)
                .add(new NamedValidator<>("Descrição", new NaoBrancoValidator()), this.descricao)
                .add(new NamedValidator<>("Descrição", new CaracteresEspeciaisValidator()), this.descricao)
                .add(new NamedValidator<>("Descrição", new TamanhoMinimoValidator(3)), this.descricao)
                .add(new NamedValidator<>("Descrição", new TamanhoMaximoValidator(50)), this.descricao)
                .add(new NamedValidator<>("Cor", new ObjetoNaoNuloValidator()), this.cor)
                .add(new NamedValidator<>("Medidas", new ObjetoNaoNuloValidator()), this.medidas)
                .add(new NamedValidator<>("Implantação", new DataFuturaValidator()), this.implantacao)
                .add(new NamedValidator<>("Valor", new NumeroMaiorOuIgualAZeroValidator()), this.valor)
                .add(new NamedValidator<>("Tipo", new ObjetoNaoNuloValidator()), this.tipo)
                .validate();
    }

    @Override
    public String getDescricao() {
        return this.descricao;
    }

    public Double calcularValor(){
        double valor = 0.0;
        for(DFilho filho : filhos){
            valor += filho.calcularValor();
        }
        for(DMaterialUsado materialUsado : materiaisUsados){
            valor += materialUsado.calcularValor();
        }
        for(DAcessorioUsado acessorioUsado : acessoriosUsados){
            valor += acessorioUsado.calcularValor();
        }
        if(roteiro != null){
            valor += roteiro.calcularValor();
        }
        valor = FormatadorNumeros.formatarValor(valor);
        this.setValor(valor);
        return valor;
    }
}
