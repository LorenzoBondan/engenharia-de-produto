package br.com.todeschini.webapi.rest.publico.lixeira;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.PagedBuilder;
import br.com.todeschini.domain.business.publico.lixeira.DLixeira;
import br.com.todeschini.domain.exceptions.ResourceNotFoundException;
import br.com.todeschini.domain.util.tests.LixeiraFactory;
import br.com.todeschini.persistence.publico.lixeira.LixeiraOperationsImpl;
import br.com.todeschini.webapi.ApiTestUtil;
import br.com.todeschini.webapi.BaseControllerIT;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpMethod;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Transactional
@SpringBootTest
@AutoConfigureMockMvc
public class LixeiraControllerTests extends BaseControllerIT<DLixeira> {

    @MockBean
    private LixeiraOperationsImpl operations;

    protected Paged<DLixeira> pagedResult;
    protected PageableRequest pageableRequest = new PageableRequest();

    @BeforeEach
    void setUp() throws Exception {
        setConfiguration("/api/lixeira");

        factoryObject = LixeiraFactory.createDLixeira();

        // findAll
        pagedResult = new PagedBuilder<DLixeira>()
                .withContent(List.of(factoryObject))
                .withPage(0)
                .withSize(10)
                .withTotalPages(1)
                .withNumberOfElements(1)
                .build();

        pageableRequest.setPage(0);
        pageableRequest.setPageSize(10);
        String[] sort = {"id;d"};
        pageableRequest.setSort(sort);

        when(operations.buscar(any(PageableRequest.class))).thenReturn(pagedResult);

        // retrieve
        doNothing().when(operations).recuperar(eq(existingId), anyBoolean());
        doThrow(ResourceNotFoundException.class).when(operations).recuperar(eq(nonExistingId), anyBoolean());
    }

    @Test
    public void pesquisarTodosShouldReturnPagedListTest() throws Exception {
        String jsonBody = objectMapper.writeValueAsString(pageableRequest);
        ApiTestUtil.performRequest(mockMvc, HttpMethod.GET, baseUrl + "?colunas=&operacoes=&valores=&sort=id;d", jsonBody, adminAccessToken, status().isOk());
        verify(operations, times(1)).buscar(any(PageableRequest.class));
    }

    @Test
    public void recuperarShouldReturnOkWhenIdExistsTest() throws Exception {
        ApiTestUtil.performRequest(mockMvc, HttpMethod.GET, baseUrl + "/recuperar/" + existingId + "?recuperarDependencias=true", "{}", adminAccessToken, status().isOk());
        verify(operations, times(1)).recuperar(existingId, true);
    }

    @Test
    public void recuperarShouldThrowResourceNotFoundExceptionWhenIdDoesNotExistsTest() throws Exception {
        ApiTestUtil.performRequest(mockMvc, HttpMethod.GET, baseUrl + "/recuperar/" + nonExistingId + "?recuperarDependencias=true", "{}", adminAccessToken, status().isNotFound());
        verify(operations, times(1)).recuperar(nonExistingId, true);
    }
}
