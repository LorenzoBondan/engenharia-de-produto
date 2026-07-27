package br.com.todeschini.persistence.publico.useranexo;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.user.DUser;
import br.com.todeschini.domain.business.publico.useranexo.DUserAnexo;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.publico.Anexo;
import br.com.todeschini.persistence.entities.publico.User;
import br.com.todeschini.persistence.entities.publico.UserAnexo;
import br.com.todeschini.persistence.publico.anexo.AnexoDomainToEntityAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@EntityAdapter(entityClass = UserAnexo.class)
public class UserAnexoDomainToEntityAdapter implements Convertable<UserAnexo, DUserAnexo> {

    @Autowired
    private AnexoDomainToEntityAdapter anexoDomainToEntityAdapter;

    @Override
    public UserAnexo toEntity(DUserAnexo domain) {
        return UserAnexo.builder()
                .cduserAnexo(domain.getCodigo())
                .user(new User(domain.getUser().getId()))
                .anexo(new Anexo(domain.getAnexo().getCodigo()))
                .build();
    }

    @Override
    public DUserAnexo toDomain(UserAnexo entity) {
        return DUserAnexo.builder()
                .codigo(entity.getCduserAnexo())
                .user(Optional.ofNullable(entity.getUser())
                        .map(user -> new DUser(user.getId()))
                        .orElse(null))
                .anexo(Optional.ofNullable(entity.getAnexo())
                        .map(anexoDomainToEntityAdapter::toDomain)
                        .orElse(null))
                .situacao(Optional.ofNullable(entity.getSituacao())
                        .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                        .orElse(null))
                .build();
    }
}
