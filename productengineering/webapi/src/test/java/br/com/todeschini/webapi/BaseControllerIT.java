package br.com.todeschini.webapi;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.PagedBuilder;
import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.exceptions.RegistroDuplicadoException;
import br.com.todeschini.domain.exceptions.ResourceNotFoundException;
import br.com.todeschini.persistence.entities.enums.SituacaoEnum;
import br.com.todeschini.webapi.rest.auth.TokenUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Transactional
@SpringBootTest
@AutoConfigureMockMvc
public class BaseControllerIT<D> {

    @Value("${todeschini.users.admin.email}")
    private String adminEmail;
    @Value("${todeschini.users.admin.password}")
    private String adminPassword;
    @Value("${todeschini.users.operator.email}")
    private String readOnlyEmail;
    @Value("${todeschini.users.operator.password}")
    private String readOnlyPassword;

    @Autowired
    private TokenUtil tokenUtil;
    @Autowired
    protected MockMvc mockMvc;
    @Autowired
    protected ObjectMapper objectMapper;

    protected String baseUrl;

    protected static final Integer existingId = 1, nonExistingId = 99999999;
    protected String situacaoListBody, adminAccessToken, readOnlyAccessToken;
    protected D factoryObject, duplicatedObject, nonExistingObject;
    protected final List<SituacaoEnum> situacaoList = new ArrayList<>();
    protected List<DHistory<D>> historyList = new ArrayList<>();
    protected SimpleCrud<D, Integer> crud;
    protected Paged<D> pagedResult;
    protected PageableRequest pageableRequest = new PageableRequest();

    public void setConfiguration(String baseUrl) throws Exception { // define configurações de autenticação e situação
        this.baseUrl = baseUrl;
        situacaoList.add(SituacaoEnum.ATIVO);
        situacaoListBody = new ObjectMapper().writeValueAsString(situacaoList);

        historyList = List.of(new DHistory<>(existingId, factoryObject));

        adminAccessToken = tokenUtil.obtainAccessToken(mockMvc, new UserTest(adminEmail, adminPassword));
        readOnlyAccessToken = tokenUtil.obtainAccessToken(mockMvc, new UserTest(readOnlyEmail, readOnlyPassword));
    }

    public void setCrudBehavior(D factoryObject, D nonExistingObject, SimpleCrud<D, Integer> crud){ // define o comportamento dos métodos do CRUD
        this.crud = crud;

        // findAll
        pagedResult = new PagedBuilder<D>()
                .withContent(List.of(factoryObject))
                .withPage(0)
                .withSize(10)
                .withTotalPages(1)
                .withNumberOfElements(1)
                .build();

        pageableRequest.setPage(0);
        pageableRequest.setPageSize(10);
        String[] sort = {"codigo;d"};
        pageableRequest.setSort(sort);

        when(crud.buscarTodos(any(PageableRequest.class))).thenReturn(pagedResult);

        // findById
        when(crud.buscar(existingId)).thenReturn(factoryObject);
        doThrow(ResourceNotFoundException.class).when(crud).buscar(nonExistingId);

        // findHistory
        when(crud.buscarHistorico(existingId)).thenReturn(historyList);

        // insert
        when(crud.inserir(any())).thenReturn(factoryObject);
        doThrow(RegistroDuplicadoException.class).when(crud).inserir(duplicatedObject);

        // update
        when(crud.atualizar(any())).thenReturn(factoryObject);
        doThrow(ResourceNotFoundException.class).when(crud).atualizar(nonExistingObject);
        doThrow(RegistroDuplicadoException.class).when(crud).atualizar(duplicatedObject);

        // replaceVersion
        when(crud.substituirPorVersaoAntiga(existingId, 1)).thenReturn(factoryObject);
        doThrow(ResourceNotFoundException.class).when(crud).substituirPorVersaoAntiga(nonExistingId, nonExistingId);

        // inactivate
        doNothing().when(crud).inativar(existingId);
        doThrow(ResourceNotFoundException.class).when(crud).inativar(nonExistingId);

        // delete
        doNothing().when(crud).remover(existingId);
        doThrow(ResourceNotFoundException.class).when(crud).remover(nonExistingId);
    }

    public void pesquisarTodosShouldReturnPagedList() throws Exception {
        String jsonBody = objectMapper.writeValueAsString(pageableRequest);
        ApiTestUtil.performRequest(mockMvc, HttpMethod.GET, baseUrl + "?colunas=&operacoes=&valores=&sort=codigo;d", jsonBody, adminAccessToken, status().isOk());
        verify(crud, times(1)).buscarTodos(any(PageableRequest.class));
    }

    public void pesquisarPorIdShouldReturnObject() throws Exception {
        ApiTestUtil.performRequest(mockMvc, HttpMethod.GET, baseUrl + "/" + existingId, "{}", adminAccessToken, status().isOk());
        ApiTestUtil.performRequest(mockMvc, HttpMethod.GET, baseUrl + "/" + existingId, "{}", readOnlyAccessToken, status().isOk());
        verify(crud, times(2)).buscar(existingId);
    }

    public void pesquisarPorIdShouldThrowResourceNotFoundExceptionWhenIdDoesNotExists() throws Exception {
        ApiTestUtil.performRequest(mockMvc, HttpMethod.GET, baseUrl + "/" + nonExistingId, "{}", adminAccessToken, status().isNotFound());
        ApiTestUtil.performRequest(mockMvc, HttpMethod.GET, baseUrl + "/" + nonExistingId, "{}", readOnlyAccessToken, status().isNotFound());
        verify(crud, times(2)).buscar(nonExistingId);
    }

    public void pesquisarHistoricoShouldReturnHistoryList() throws Exception {
        ApiTestUtil.performRequest(mockMvc, HttpMethod.GET, baseUrl + "/historico?codigo=" + existingId, "{}", adminAccessToken, status().isOk());
        verify(crud, times(1)).buscarHistorico(existingId);
    }

    public void criarShouldReturnObject() throws Exception {
        String jsonBody = objectMapper.writeValueAsString(factoryObject);
        ApiTestUtil.performRequest(mockMvc, HttpMethod.POST, baseUrl, jsonBody, adminAccessToken, status().isCreated());
        verify(crud, times(1)).inserir(factoryObject);
    }

    public void criarShouldThrowRegistroDuplicadoExceptionWhenObjectHasDuplicatedDescription() throws Exception {
        String jsonBody = objectMapper.writeValueAsString(duplicatedObject);
        ApiTestUtil.performRequest(mockMvc, HttpMethod.POST, baseUrl, jsonBody, adminAccessToken, status().isConflict());
        verify(crud, times(0)).inserir(duplicatedObject);
    }

    public void atualizarShouldReturnOkWhenValidData() throws Exception {
        String jsonBody = objectMapper.writeValueAsString(factoryObject);
        ApiTestUtil.performRequest(mockMvc, HttpMethod.PUT, baseUrl, jsonBody, adminAccessToken, status().isOk());
        verify(crud, times(1)).atualizar(factoryObject);
    }

    public void atualizarShouldThrowResourceNotFoundExceptionWhenObjectIdDoesNotExists() throws Exception {
        String jsonBody = objectMapper.writeValueAsString(nonExistingObject);
        ApiTestUtil.performRequest(mockMvc, HttpMethod.PUT, baseUrl, jsonBody, adminAccessToken, status().isNotFound());
        verify(crud, times(1)).atualizar(nonExistingObject);
    }

    public void atualizarShouldThrowRegistroDuplicadoExceptionWhenObjectHasDuplicatedDescription() throws Exception {
        String jsonBody = objectMapper.writeValueAsString(duplicatedObject);
        ApiTestUtil.performRequest(mockMvc, HttpMethod.PUT, baseUrl, jsonBody, adminAccessToken,status().isConflict());
        verify(crud, times(0)).atualizar(duplicatedObject);
    }

    public void substituirPorVersaoAntigaShouldReturnObject() throws Exception {
        ApiTestUtil.performRequest(mockMvc, HttpMethod.PUT, baseUrl + "/substituir?codigoRegistro=" + existingId + "&codigoVersao=" + existingId, "{}", adminAccessToken, status().isOk());
        verify(crud, times(1)).substituirPorVersaoAntiga(existingId, existingId);
    }

    public void substituirPorVersaoAntigaShouldThrowResourceNotFoundExceptionWhenIdDoesNotExists() throws Exception {
        ApiTestUtil.performRequest(mockMvc, HttpMethod.PUT, baseUrl + "/substituir?codigoRegistro=" + nonExistingId + "&codigoVersao=" + nonExistingId, "{}", adminAccessToken, status().isNotFound());
        verify(crud, times(1)).substituirPorVersaoAntiga(nonExistingId, nonExistingId);
    }

    public void inativarShouldReturnOkWhenIdExists() throws Exception {
        ApiTestUtil.performRequest(mockMvc, HttpMethod.PATCH, baseUrl + "/inativar?codigo=" + existingId, "{}", adminAccessToken, status().isOk());
        verify(crud, times(1)).inativar(existingId);
    }

    public void inativarShouldThrowPartialContentExceptionWhenIdDoesNotExists() throws Exception {
        ApiTestUtil.performRequest(mockMvc, HttpMethod.PATCH, baseUrl + "/inativar?codigo=" + nonExistingId, "{}", adminAccessToken, status().isPartialContent());
        verify(crud, times(1)).inativar(nonExistingId);
    }

    public void deletarShouldReturnOkWhenIdExists() throws Exception {
        ApiTestUtil.performRequest(mockMvc, HttpMethod.DELETE, baseUrl + "?codigo=" + existingId, "{}", adminAccessToken, status().isOk());
        verify(crud, times(1)).remover(existingId);
    }

    public void deletarShouldThrowPartialContentExceptionWhenIdDoesNotExists() throws Exception {
        ApiTestUtil.performRequest(mockMvc, HttpMethod.DELETE, baseUrl + "?codigo=" + nonExistingId, "{}", adminAccessToken, status().isPartialContent());
        verify(crud, times(1)).remover(nonExistingId);
    }

    protected void validate(D object) throws Exception {
        String jsonBody = objectMapper.writeValueAsString(object);
        ApiTestUtil.performRequest(mockMvc, HttpMethod.PUT, baseUrl, jsonBody, adminAccessToken, status().isUnprocessableEntity());
    }
}
