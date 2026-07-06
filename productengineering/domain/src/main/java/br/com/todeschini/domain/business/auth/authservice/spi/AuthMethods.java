package br.com.todeschini.domain.business.auth.authservice.spi;

import br.com.todeschini.domain.business.publico.user.DUser;

public interface AuthMethods {

    DUser authenticated();
    void validateSelfOrAdmin(Integer userId);
}
