package br.com.todeschini.persistence.publico.role;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.publico.role.DRole;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.publico.Role;
import org.springframework.stereotype.Component;

@Component
@EntityAdapter(entityClass = Role.class)
public class RoleDomainToEntityAdapter implements Convertable<Role, DRole> {

    @Override
    public Role toEntity(DRole domain) {
        return Role.builder()
                .id(domain.getId())
                .authority(domain.getAuthority())
                .build();
    }

    @Override
    public DRole toDomain(Role entity) {
        return DRole.builder()
                .id(entity.getId())
                .authority(entity.getAuthority())
                .build();
    }
}
