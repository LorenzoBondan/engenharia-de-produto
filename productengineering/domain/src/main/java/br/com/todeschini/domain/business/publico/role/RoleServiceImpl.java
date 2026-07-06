package br.com.todeschini.domain.business.publico.role;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.role.api.RoleService;
import br.com.todeschini.domain.business.publico.role.spi.CrudRole;
import br.com.todeschini.domain.metadata.DomainService;

@DomainService
public class RoleServiceImpl implements RoleService {

    private final CrudRole crudRole;

    public RoleServiceImpl(CrudRole crudRole) {
        this.crudRole = crudRole;
    }

    @Override
    public Paged<DRole> buscar(PageableRequest request) {
        return crudRole.buscarTodos(request);
    }

    @Override
    public DRole buscar(Integer id) {
        return crudRole.buscar(id);
    }
}
