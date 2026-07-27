package br.com.todeschini.persistence.auth.authservice;

import br.com.todeschini.domain.business.auth.authservice.spi.AuthMethods;
import br.com.todeschini.domain.business.publico.user.DUser;
import br.com.todeschini.domain.exceptions.ForbiddenException;
import br.com.todeschini.persistence.entities.publico.User;
import br.com.todeschini.persistence.publico.user.UserDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.user.UserRepository;
import br.com.todeschini.persistence.util.CustomUserUtil;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class AuthMethodsImpl implements AuthMethods {

    private final UserRepository repository;
    private final UserDomainToEntityAdapter adapter;
    private final CustomUserUtil customUserUtil;

    public AuthMethodsImpl(UserRepository repository, UserDomainToEntityAdapter adapter, CustomUserUtil customUserUtil) {
        this.repository = repository;
        this.adapter = adapter;
        this.customUserUtil = customUserUtil;
    }

    @Override
    public DUser authenticated() {
        try {
            String username = customUserUtil.getLoggedUsername();
            return adapter.toDomain(repository.findByEmail(username).iterator().next());
        }
        catch (Exception e) {
            throw new UsernameNotFoundException("Invalid user");
        }
    }

    @Override
    public void validateSelfOrAdmin(Integer userId) {
        User me = adapter.toEntity(authenticated());
        if (me.hasRole("ROLE_ADMIN")) {
            return;
        }
        if(!me.getId().equals(userId)) {
            throw new ForbiddenException("Acesso negado. Deve ser admin");
        }
    }
}
