package br.com.todeschini.domain.business.publico.pai;

import br.com.todeschini.domain.Descritivel;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.enums.DTipoPinturaEnum;
import br.com.todeschini.domain.business.publico.categoriacomponente.DCategoriaComponente;
import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.modelo.DModelo;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.domain.metadata.BatchEditable;
import br.com.todeschini.domain.metadata.Domain;
import br.com.todeschini.domain.validation.NamedValidator;
import br.com.todeschini.domain.validation.ValidationBuilder;
import br.com.todeschini.domain.validation.impl.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Domain
public class DPai implements Descritivel {

    @EqualsAndHashCode.Include
    private Integer codigo;
    @BatchEditable
    private DModelo modelo;
    @BatchEditable
    private DCategoriaComponente categoriaComponente;
    private String descricao;
    @BatchEditable
    private Integer bordasComprimento;
    @BatchEditable
    private Integer bordasLargura;
    @BatchEditable
    private Integer numeroCantoneiras;
    @BatchEditable
    private Boolean tntUmaFace;
    @BatchEditable
    private Boolean plasticoAcima;
    @BatchEditable
    private Double plasticoAdicional;
    @BatchEditable
    private Integer larguraPlastico;
    @BatchEditable
    private Integer faces;
    @BatchEditable
    private Boolean especial;
    @BatchEditable
    private DTipoPinturaEnum tipoPintura;
    private DSituacaoEnum situacao;

    private List<DFilho> filhos = new ArrayList<>();

    public DPai(Integer codigo){
        this.codigo = codigo;
    }

    public void validar() throws ValidationException {
        new ValidationBuilder()
                .add(new NamedValidator<>("Modelo", new ObjetoNaoNuloValidator()), this.modelo)
                .add(new NamedValidator<>("Categoria Componente", new ObjetoNaoNuloValidator()), this.categoriaComponente)
                .add(new NamedValidator<>("Descrição", new ObjetoNaoNuloValidator()), this.descricao)
                .add(new NamedValidator<>("Descrição", new NaoBrancoValidator()), this.descricao)
                .add(new NamedValidator<>("Descrição", new CaracteresEspeciaisValidator()), this.descricao)
                .add(new NamedValidator<>("Descrição", new TamanhoMinimoValidator(3)), this.descricao)
                .add(new NamedValidator<>("Descrição", new TamanhoMaximoValidator(50)), this.descricao)
                .add(new NamedValidator<>("Bordas Comprimento", new NumeroMaiorOuIgualAZeroValidator()), this.bordasComprimento)
                .add(new NamedValidator<>("Bordas Largura", new NumeroMaiorOuIgualAZeroValidator()), this.bordasLargura)
                .add(new NamedValidator<>("Número Cantoneiras", new NumeroMaiorOuIgualAZeroValidator()), this.numeroCantoneiras)
                .add(new NamedValidator<>("Plástico adicional", new NumeroMaiorOuIgualAZeroValidator()), this.plasticoAdicional)
                .add(new NamedValidator<>("Largura Plástico", new NumeroMaiorOuIgualAZeroValidator()), this.larguraPlastico)
                .add(new NamedValidator<>("Faces", new NumeroMaiorOuIgualAZeroValidator()), this.faces)

                .validate();
    }

    @Override
    public String getDescricao() {
        return this.descricao;
    }

    public void gerarDescricao(){
        this.setDescricao(categoriaComponente.getDescricao() + " " + modelo.getDescricao());
    }
}
