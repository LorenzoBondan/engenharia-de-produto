package br.com.todeschini.domain.business.publico.user;

import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.role.DRole;
import br.com.todeschini.domain.business.publico.useranexo.DUserAnexo;
import br.com.todeschini.domain.metadata.Domain;
import br.com.todeschini.domain.validation.NamedValidator;
import br.com.todeschini.domain.validation.ValidationBuilder;
import br.com.todeschini.domain.validation.impl.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Domain
public class DUser {

    @EqualsAndHashCode.Include
    private Integer id;
    private String name;
    private String password;
    private String email;
    private DSituacaoEnum situacao;
    private DUserAnexo userAnexo;
    private List<DRole> roles = new ArrayList<>();

    public DUser(Integer id){
        this.id = id;
    }

    public void validate(){
        new ValidationBuilder()
                .add(new NamedValidator<>("Nome", new ObjetoNaoNuloValidator()), this.name)
                .add(new NamedValidator<>("Nome", new NaoBrancoValidator()), this.name)
                .add(new NamedValidator<>("Nome", new TamanhoMinimoValidator(3)), this.name)
                .add(new NamedValidator<>("Nome", new TamanhoMaximoValidator(50)), this.name)
                .add(new NamedValidator<>("Senha", new ObjetoNaoNuloValidator()), this.password)
                .add(new NamedValidator<>("Senha", new NaoBrancoValidator()), this.password)
                .add(new NamedValidator<>("Senha", new TamanhoMinimoValidator(5)), this.password)
                .add(new NamedValidator<>("Senha", new TamanhoMaximoValidator(250)), this.password)
                .add(new NamedValidator<>("Email", new ObjetoNaoNuloValidator()), this.email)
                .add(new NamedValidator<>("Email", new EmailValidator()), this.email)
                .add(new NamedValidator<>("Papéis", new ObjetoNaoNuloValidator()), this.roles)
                .validate();
    }
}
