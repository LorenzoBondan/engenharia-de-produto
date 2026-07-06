package br.com.todeschini.domain.business.publico.useranexo;

import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.anexo.DAnexo;
import br.com.todeschini.domain.business.publico.user.DUser;
import br.com.todeschini.domain.metadata.Domain;
import br.com.todeschini.domain.validation.NamedValidator;
import br.com.todeschini.domain.validation.ValidationBuilder;
import br.com.todeschini.domain.validation.impl.ObjetoNaoNuloValidator;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Domain
public class DUserAnexo {

    @EqualsAndHashCode.Include
    private Integer codigo;
    private DUser user;
    private DAnexo anexo;
    private DSituacaoEnum situacao;

    public DUserAnexo(Integer codigo){
        this.codigo = codigo;
    }

    public void validate(){
        new ValidationBuilder()
                .add(new NamedValidator<>("User", new ObjetoNaoNuloValidator()), this.user)
                .add(new NamedValidator<>("Anexo", new ObjetoNaoNuloValidator()), this.anexo)
                .validate();
    }
}
