package br.com.todeschini.domain.business.publico.anexo;

import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.binario.DBinario;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.domain.metadata.BatchEditable;
import br.com.todeschini.domain.metadata.Domain;
import br.com.todeschini.domain.validation.NamedValidator;
import br.com.todeschini.domain.validation.ValidationBuilder;
import br.com.todeschini.domain.validation.impl.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Domain
public class DAnexo {

    @EqualsAndHashCode.Include
    private Integer codigo;
    @BatchEditable
    private DBinario binario;
    @BatchEditable
    private String nome;
    @BatchEditable
    private String mimeType;
    private DSituacaoEnum situacao;

    public DAnexo(Integer codigo){
        this.codigo = codigo;
    }

    public void validar() throws ValidationException {
        new ValidationBuilder()
                .add(new NamedValidator<>("Nome", new ObjetoNaoNuloValidator()), this.nome)
                .add(new NamedValidator<>("Nome", new NaoBrancoValidator()), this.nome)
                .add(new NamedValidator<>("Nome", new CaracteresEspeciaisValidator()), this.nome)
                .add(new NamedValidator<>("Nome", new TamanhoMinimoValidator(3)), this.nome)
                .add(new NamedValidator<>("Nome", new TamanhoMaximoValidator(100)), this.nome)
                .add(new NamedValidator<>("Mime Type", new ObjetoNaoNuloValidator()), this.mimeType)
                .add(new NamedValidator<>("Mime Type", new NaoBrancoValidator()), this.mimeType)
                .add(new NamedValidator<>("Mime Type", new TamanhoMinimoValidator(3)), this.mimeType)
                .add(new NamedValidator<>("Mime Type", new TamanhoMaximoValidator(100)), this.mimeType)
                .validate();
    }
}
