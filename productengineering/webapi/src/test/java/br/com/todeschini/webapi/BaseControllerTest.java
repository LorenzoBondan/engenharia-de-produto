package br.com.todeschini.webapi;

import br.com.todeschini.domain.Descritivel;
import br.com.todeschini.persistence.entities.publico.AuditoriaInfo;
import br.com.todeschini.persistence.entities.publico.History;
import br.com.todeschini.persistence.publico.history.HistoryRepository;
import br.com.todeschini.persistence.util.DynamicRepositoryFactory;
import br.com.todeschini.webapi.rest.auth.TokenUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Classe genérica para testes unitários (sem mock) da camada de API
 * Testes dos métodos do BaseCrud
 * @param <T> Domain
 * @param <E> Entidade
 */
public abstract class BaseControllerTest<T extends Descritivel, E extends AuditoriaInfo> {

    @Autowired
    private DynamicRepositoryFactory dynamicRepositoryFactory;

    @Autowired
    private TestDataInitializer testDataInitializer;

    protected MockMvc mockMvc;
    protected ObjectMapper objectMapper;
    protected HistoryRepository historyRepository;
    protected TokenUtil tokenUtil;

    public T novaEntidade;
    protected Integer idCriado;
    public String baseUrl;

    private boolean hasDescricao = true;

    protected void setHasDescricao(boolean hasDescricao) {
        this.hasDescricao = hasDescricao;
    }

    public BaseControllerTest(MockMvc mockMvc, ObjectMapper objectMapper, HistoryRepository historyRepository, TokenUtil tokenUtil) {
        this.mockMvc = mockMvc;
        this.objectMapper = objectMapper;
        this.historyRepository = historyRepository;
        this.tokenUtil = tokenUtil;
    }

    /**
     * Initializes reference data before each test.
     * Called automatically by Spring's dependency injection after construction.
     */
    protected void initializeTestData() {
        if (testDataInitializer != null) {
            testDataInitializer.initializeReferenceData();
        }
    }

    protected abstract Class<E> getEntityClass();
    protected abstract String getDescricao(T entidade);
    protected abstract void setCodigo(T entidade, Integer codigo);
    protected abstract void setDescricao(T entidade, String descricao);
    
    public String getAccessToken() throws Exception {
        return tokenUtil.obtainAccessToken(mockMvc, new UserTest("maria@gmail.com", "123456"));
    }

    public void deveCriarNovaEntidade() throws Exception {
        ResultActions resultActions = mockMvc.perform(post(baseUrl)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + getAccessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(novaEntidade)))
                .andExpect(status().isCreated());

        if (hasDescricao) {
            resultActions.andExpect(jsonPath("$.descricao").value(getDescricao(novaEntidade)));
        }

        // Extrair o ID do corpo da resposta
        String resultString = resultActions.andReturn().getResponse().getContentAsString();
        JsonNode jsonNode = objectMapper.readTree(resultString);
        idCriado = jsonNode.get("codigo").asInt();
    }

    public void devePesquisarComFiltros() throws Exception {
        mockMvc.perform(get(baseUrl)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + getAccessToken())
                        .param("colunas", "")
                        .param("operacoes", "")
                        .param("valores", "")
                        .param("page", "0")
                        .param("pageSize", "10")
                        .param("sort", "codigo;a"))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content").isNotEmpty());
    }

    public void devePesquisarPorId() throws Exception {
        if (idCriado == null) {
            throw new IllegalStateException("O ID não foi inicializado. Execute o teste de criação primeiro.");
        }

        ResultActions resultActions = mockMvc.perform(
                        get(baseUrl + "/{id}", idCriado)
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + getAccessToken())
                )
                .andExpect(status().isOk());

        if (hasDescricao) {
            resultActions.andExpect(jsonPath("$.descricao").value(novaEntidade.getDescricao()));
        }
    }

    public void devePesquisarHistorico() throws Exception {
        mockMvc.perform(get(baseUrl + "/historico")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + getAccessToken())
                        .param("codigo", idCriado.toString()))
                .andExpect(status().isOk());
    }

    public void deveAtualizarEntidadeExistente() throws Exception {
        setCodigo(novaEntidade, idCriado);
        if (hasDescricao) {
            setDescricao(novaEntidade, novaEntidade.getDescricao() + " Atualizada");
        }

        ResultActions resultActions = mockMvc.perform(put(baseUrl)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + getAccessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(novaEntidade)))
                .andExpect(status().isOk());

        if (hasDescricao) {
            resultActions.andExpect(jsonPath("$.descricao").value(novaEntidade.getDescricao()));
        }
    }

    public void deveSubstituirVersao(String tabName, String idName) throws Exception {
        List<History> historico = historyRepository.findByTabnameAndRecordId(tabName, idName, idCriado.toString());
        Integer codigoVersaoAnterior = historico.get(0).getId();

        mockMvc.perform(put( baseUrl + "/substituir")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + getAccessToken())
                        .param("codigoRegistro", idCriado.toString())
                        .param("codigoVersao", codigoVersaoAnterior.toString()))
                .andExpect(status().isOk());
    }

    public void deveInativarEntidade() throws Exception {
        mockMvc.perform(patch( baseUrl + "/inativar")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + getAccessToken())
                        .param("codigo", idCriado.toString()))
                .andExpect(status().isOk());

        E entity = (E) dynamicRepositoryFactory.createRepository(getEntityClass()).findById(idCriado).orElseThrow(() -> new AssertionError("Entidade não encontrada"));

        assertEquals("INATIVO", entity.getSituacao().name());
    }

    public void deveDeletarEntidade() throws Exception {
        mockMvc.perform(delete(baseUrl)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + getAccessToken())
                        .param("codigo", idCriado.toString()))
                .andExpect(status().isOk());

        E entity = (E) dynamicRepositoryFactory.createRepository(getEntityClass()).findById(idCriado).orElseThrow(() -> new AssertionError("Entidade não encontrada"));

        assertEquals("LIXEIRA", entity.getSituacao().name());
    }
}

