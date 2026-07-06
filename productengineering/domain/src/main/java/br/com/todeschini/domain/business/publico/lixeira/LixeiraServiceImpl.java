package br.com.todeschini.domain.business.publico.lixeira;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.lixeira.api.LixeiraService;
import br.com.todeschini.domain.business.publico.lixeira.spi.LixeiraOperations;
import br.com.todeschini.domain.metadata.DomainService;

import java.util.Map;

@DomainService
public class LixeiraServiceImpl implements LixeiraService {

    private final LixeiraOperations lixeiraOperations;

    public LixeiraServiceImpl(LixeiraOperations lixeiraOperations) {
        this.lixeiraOperations = lixeiraOperations;
    }

    @Override
    public Paged<DLixeira> buscar(PageableRequest request) {
        return lixeiraOperations.buscar(request);
    }

    @Override
    public <T> void incluir(T entity) throws IllegalAccessException {
        lixeiraOperations.incluir(entity);
    }

    @Override
    public <T> void recuperar(Integer id, Boolean recuperarDependencias) {
        lixeiraOperations.recuperar(id, recuperarDependencias);
    }

    @Override
    public <T> void recuperarPorEntidadeId(Map<String, Object> entidadeid, Boolean recuperarDependencias) {
        lixeiraOperations.recuperarPorEntidadeId(entidadeid, recuperarDependencias);
    }

    @Override
    public <T> void remover(T entity) throws IllegalAccessException {
        lixeiraOperations.remover(entity);
    }
}
