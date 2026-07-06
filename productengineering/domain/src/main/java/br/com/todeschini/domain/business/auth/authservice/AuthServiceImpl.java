package br.com.todeschini.domain.business.auth.authservice;

import br.com.todeschini.domain.business.auth.authservice.api.AuthService;
import br.com.todeschini.domain.business.auth.authservice.spi.AuthMethods;
import br.com.todeschini.domain.business.publico.user.DUser;
import br.com.todeschini.domain.metadata.DomainService;

@DomainService
public class AuthServiceImpl implements AuthService {

    private final AuthMethods authMethods;

    public AuthServiceImpl(AuthMethods authMethods) {
        this.authMethods = authMethods;
    }

    @Override
    public DUser authenticated() {
        return authMethods.authenticated();
    }

    @Override
    public void validateSelfOrAdmin(Integer userId) {
        authMethods.validateSelfOrAdmin(userId);
    }
}
