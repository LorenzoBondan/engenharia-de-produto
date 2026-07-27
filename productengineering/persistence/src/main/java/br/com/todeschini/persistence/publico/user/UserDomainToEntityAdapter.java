package br.com.todeschini.persistence.publico.user;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.role.DRole;
import br.com.todeschini.domain.business.publico.user.DUser;
import br.com.todeschini.domain.business.publico.useranexo.DUserAnexo;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.publico.Role;
import br.com.todeschini.persistence.entities.publico.User;
import br.com.todeschini.persistence.entities.publico.UserAnexo;
import br.com.todeschini.persistence.publico.useranexo.UserAnexoDomainToEntityAdapter;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.stream.Collectors;

@Component
@EntityAdapter(entityClass = User.class)
public class UserDomainToEntityAdapter implements Convertable<User, DUser> {

    private final UserAnexoDomainToEntityAdapter userAnexoDomainToEntityAdapter;

    public UserDomainToEntityAdapter(UserAnexoDomainToEntityAdapter userAnexoDomainToEntityAdapter) {
        this.userAnexoDomainToEntityAdapter = userAnexoDomainToEntityAdapter;
    }

    @Override
    public User toEntity(DUser domain) {
        return User.builder()
                .id(domain.getId())
                .name(domain.getName())
                .password(domain.getPassword())
                .email(domain.getEmail())
                .userAnexo(Optional.ofNullable(domain.getUserAnexo())
                        .map(userAnexo -> new UserAnexo(userAnexo.getCodigo()))
                        .orElse(null))

                .roles(domain.getRoles().stream().map(role -> new Role(role.getId(), role.getAuthority())).collect(Collectors.toSet()))

                .build();
    }

    @Override
    public DUser toDomain(User entity) {
        return DUser.builder()
                .id(entity.getId())
                .name(entity.getName())
                .password(entity.getPassword())
                .email(entity.getEmail())
                .userAnexo(Optional.ofNullable(entity.getUserAnexo())
                        .map(userAnexoDomainToEntityAdapter::toDomain)
                        .orElse(null))
                .situacao(Optional.ofNullable(entity.getSituacao())
                        .map(situacao -> DSituacaoEnum.valueOf(situacao.name()))
                        .orElse(null))

                .roles(entity.getRoles().stream().map(role -> new DRole(role.getId(), role.getAuthority())).collect(Collectors.toList()))

                .build();
    }
}
