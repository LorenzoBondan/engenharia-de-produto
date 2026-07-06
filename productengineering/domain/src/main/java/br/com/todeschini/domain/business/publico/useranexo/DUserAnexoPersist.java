package br.com.todeschini.domain.business.publico.useranexo;

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
public class DUserAnexoPersist {

    @EqualsAndHashCode.Include
    private Integer codigo;
    private byte[] bytes;
    private String name;
    private String mimeType;
    private DUser user;

    public DUserAnexoPersist(Integer codigo){
        this.codigo = codigo;
    }

    public void validate(){
        new ValidationBuilder()
                .add(new NamedValidator<>("User", new ObjetoNaoNuloValidator()), this.user)
                .add(new NamedValidator<>("Bytes", new ObjetoNaoNuloValidator()), this.bytes)
                .validate();
    }
}
