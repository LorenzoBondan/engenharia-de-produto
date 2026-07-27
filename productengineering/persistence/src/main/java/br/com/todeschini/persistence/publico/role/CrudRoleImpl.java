package br.com.todeschini.persistence.publico.role;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.PagedBuilder;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.role.DRole;
import br.com.todeschini.domain.business.publico.role.spi.CrudRole;
import br.com.todeschini.domain.exceptions.ResourceNotFoundException;
import br.com.todeschini.persistence.entities.publico.Role;
import br.com.todeschini.persistence.util.PageRequestUtils;
import br.com.todeschini.persistence.util.SpecificationHelper;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class CrudRoleImpl implements CrudRole {

    private final RoleRepository repository;
    private final RoleQueryRepository queryRepository;
    private final RoleDomainToEntityAdapter adapter;
    private final PageRequestUtils pageRequestUtils;

    public CrudRoleImpl(RoleRepository repository, RoleQueryRepository queryRepository, RoleDomainToEntityAdapter adapter, PageRequestUtils pageRequestUtils) {
        this.repository = repository;
        this.queryRepository = queryRepository;
        this.adapter = adapter;
        this.pageRequestUtils = pageRequestUtils;
    }

    @Override
    public Paged<DRole> buscarTodos(PageableRequest request) {
        SpecificationHelper<Role> helper = new SpecificationHelper<>();
        Specification<Role> specification = helper.buildSpecification(request.getColunas(), request.getOperacoes(), request.getValores());
        
        return Optional.of(queryRepository.findAll(specification, pageRequestUtils.toPage(request)))
                .map(r -> new PagedBuilder<DRole>()
                        .withContent(r.getContent().stream().map(adapter::toDomain).toList())
                        .withSortedBy(String.join(";", request.getSort()))
                        .withFirst(r.isFirst())
                        .withLast(r.isLast())
                        .withPage(r.getNumber())
                        .withSize(r.getSize())
                        .withTotalPages(r.getTotalPages())
                        .withNumberOfElements(Math.toIntExact(r.getTotalElements()))
                        .build())
                .orElse(null);
    }

    @Override
    public DRole buscar(Integer id) {
        return adapter.toDomain(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Código não encontrado: " + id)));
    }

    @Override
    public List<DHistory<DRole>> buscarHistorico(Integer id) {
        return List.of();
    }

    @Override
    public List<String> buscarAtributosEditaveisEmLote() {
        return List.of();
    }

    @Override
    public DRole inserir(DRole obj) {
        return null;
    }

    @Override
    public DRole atualizar(DRole obj) {
        return null;
    }

    @Override
    public List<DRole> atualizarEmLote(List<DRole> obj) {
        return List.of();
    }

    @Override
    public DRole substituirPorVersaoAntiga(Integer id, Integer versionId) {
        return null;
    }

    @Override
    public void inativar(Integer obj) {
    }

    @Override
    public void remover(Integer obj) {
    }
}
