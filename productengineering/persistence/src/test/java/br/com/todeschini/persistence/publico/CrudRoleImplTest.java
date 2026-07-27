package br.com.todeschini.persistence.publico;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.role.DRole;
import br.com.todeschini.persistence.entities.publico.Role;
import br.com.todeschini.persistence.filters.SituacaoFilter;
import br.com.todeschini.persistence.publico.role.CrudRoleImpl;
import br.com.todeschini.persistence.publico.role.RoleDomainToEntityAdapter;
import br.com.todeschini.persistence.publico.role.RoleQueryRepository;
import br.com.todeschini.persistence.publico.role.RoleRepository;
import br.com.todeschini.persistence.util.PageRequestUtils;
import br.com.todeschini.persistence.util.SpecificationHelper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class CrudRoleImplTest {

    @Mock
    private RoleRepository repository;
    @Mock
    private RoleQueryRepository queryRepository;
    @Mock
    private RoleDomainToEntityAdapter adapter;
    @Mock
    private PageRequestUtils pageRequestUtils;
    @Mock
    private SituacaoFilter<Role> situacaoFilter;
    private CrudRoleImpl crudRole;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        crudRole = new CrudRoleImpl(
                repository,
                queryRepository,
                adapter,
                pageRequestUtils
        );
    }

    @Test
    public void testBuscarTodos() {
        // Arrange
        PageableRequest request = new PageableRequest();
        request.setColunas(List.of("authority"));
        request.setOperacoes(List.of("="));
        request.setValores(List.of("Role A"));
        request.setSort(List.of("codigo;a").toArray(new String[0]));
        request.setPage(0);
        request.setPageSize(10);

        PageRequest pageRequest = PageRequest.of(0, 10, Sort.by("authority").ascending());

        Role entity = new Role();
        entity.setAuthority("Role A");

        DRole domain = new DRole();
        domain.setAuthority("Role A");

        SpecificationHelper<Role> helper = new SpecificationHelper<>();
        Specification<Role> specification = helper.buildSpecification(request.getColunas(), request.getOperacoes(), request.getValores());
        Page<Role> RolePage = new PageImpl<>(List.of(entity), pageRequest, 1);

        when(pageRequestUtils.toPage(request)).thenReturn(pageRequest);
        when(queryRepository.findAll(any(Specification.class), eq(pageRequest))).thenReturn(RolePage);
        when(adapter.toDomain(entity)).thenReturn(domain);
        when(situacaoFilter.addExcludeSituacaoLixeira(any(Specification.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Paged<DRole> result = crudRole.buscarTodos(request);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getNumberOfElements());
        assertEquals(1, result.getTotalPages());
        assertEquals(1, result.getContent().size());
        assertEquals("Role A", result.getContent().get(0).getAuthority());

        verify(pageRequestUtils, times(1)).toPage(request);
        verify(queryRepository, times(1)).findAll(any(Specification.class), eq(pageRequest));
        verify(adapter, times(1)).toDomain(entity);
    }

    @Test
    public void testBuscar() {
        // Arrange
        Integer id = 1;
        Role entity = new Role();
        entity.setId(id);

        // Mock do adaptador para converter a entidade em domain
        DRole domain = new DRole();
        domain.setId(id);
        when(repository.findById(id)).thenReturn(Optional.of(entity));
        when(adapter.toDomain(entity)).thenReturn(domain);  // Simula a conversão da entidade para o domínio

        // Act
        DRole result = crudRole.buscar(id);

        // Assert
        assertNotNull(result);
        assertEquals(id, result.getId());
        verify(repository, times(1)).findById(id);  // Verifica se o repositório foi chamado
        verify(adapter, times(1)).toDomain(entity); // Verifica se o adaptador foi chamado
    }
}

