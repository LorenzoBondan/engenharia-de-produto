package br.com.todeschini.webapi.rest.publico.acessoriousado;

import br.com.todeschini.domain.business.publico.acessoriousado.DAcessorioUsado;
import br.com.todeschini.domain.util.tests.AcessorioUsadoFactory;
import br.com.todeschini.persistence.entities.publico.AcessorioUsado;
import br.com.todeschini.persistence.entities.publico.Lixeira;
import br.com.todeschini.persistence.publico.acessoriousado.AcessorioUsadoRepository;
import br.com.todeschini.persistence.publico.history.HistoryRepository;
import br.com.todeschini.persistence.publico.lixeira.LixeiraRepository;
import br.com.todeschini.webapi.BaseControllerTest;
import br.com.todeschini.webapi.rest.auth.TokenUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AcessorioUsadoControllerTest extends BaseControllerTest<DAcessorioUsado, AcessorioUsado> {

    @Autowired
    private AcessorioUsadoRepository acessorioUsadoRepository;
    @Autowired
    private LixeiraRepository lixeiraRepository;

    @Autowired
    public AcessorioUsadoControllerTest(MockMvc mockMvc, ObjectMapper objectMapper, HistoryRepository historyRepository, TokenUtil tokenUtil) {
        super(mockMvc, objectMapper, historyRepository, tokenUtil);
        this.baseUrl = "/api/acessoriousado";
    }

    @BeforeAll
    public void setUp() {
        // Initialize reference data (Cor, Categoria, Modelo, etc.)
        super.initializeTestData();

        novaEntidade = AcessorioUsadoFactory.createDAcessorioUsado();
        novaEntidade.setCodigo(null);
        super.setHasDescricao(false);
    }

    @Override
    protected Class<AcessorioUsado> getEntityClass() {
        return AcessorioUsado.class;
    }

    @Override
    protected String getDescricao(DAcessorioUsado entidade) {
        return entidade.getDescricao();
    }

    @Override
    protected void setCodigo(DAcessorioUsado entidade, Integer codigo) {
        entidade.setCodigo(codigo);
    }

    @Override
    protected void setDescricao(DAcessorioUsado entidade, String descricao) {

    }

    @Test
    @Order(1)
    void deveCriarNovaEntidadeTest() throws Exception {
        super.deveCriarNovaEntidade();
    }

    @Test
    @Order(2)
    void devePesquisarComFiltrosTest() throws Exception {
        super.devePesquisarComFiltros();
    }

    @Test
    @Order(3)
    void devePesquisarPorIdTest() throws Exception {
        super.devePesquisarPorId();
    }

    @Test
    @Order(4)
    void devePesquisarHistoricoTest() throws Exception {
        super.devePesquisarHistorico();
    }

    @Test
    @Order(5)
    void deveAtualizarEntidadeExistenteTest() throws Exception {
        super.deveAtualizarEntidadeExistente();
    }

    @Test
    @Order(6)
    void deveSubstituirVersaoTest() throws Exception {
        super.deveSubstituirVersao("tb_acessorio_usado", "cdacessorio_usado");
    }

    @Test
    @Order(7)
    void deveInativarEntidadeTest() throws Exception {
        super.deveInativarEntidade();
    }

    @Test
    @Order(8)
    void deveDeletarEntidadeTest() throws Exception {
        super.deveDeletarEntidade();
    }

    @AfterAll
    void tearDown() {
        if (idCriado != null) {
            acessorioUsadoRepository.deleteById(idCriado);
            Map<String, Object> id = new HashMap<>();
            id.put("cdacessorioUsado", idCriado);
            Lixeira lixeira = lixeiraRepository.findByEntidadeid(id);
            lixeiraRepository.deleteById(lixeira.getId());
        }
    }
}
