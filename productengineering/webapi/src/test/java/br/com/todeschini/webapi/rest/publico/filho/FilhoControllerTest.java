package br.com.todeschini.webapi.rest.publico.filho;

import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.util.tests.FilhoFactory;
import br.com.todeschini.persistence.entities.publico.Filho;
import br.com.todeschini.persistence.entities.publico.Lixeira;
import br.com.todeschini.persistence.publico.filho.FilhoRepository;
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
public class FilhoControllerTest extends BaseControllerTest<DFilho, Filho> {

    @Autowired
    private FilhoRepository filhoRepository;
    @Autowired
    private LixeiraRepository lixeiraRepository;

    @Autowired
    public FilhoControllerTest(MockMvc mockMvc, ObjectMapper objectMapper, HistoryRepository historyRepository, TokenUtil tokenUtil) {
        super(mockMvc, objectMapper, historyRepository, tokenUtil);
        this.baseUrl = "/api/filho";
    }

    @BeforeAll
    public void setUp() {
        // Initialize reference data (Cor, Categoria, Modelo, etc.)
        super.initializeTestData();

        novaEntidade = FilhoFactory.createDFilho();
        novaEntidade.setCodigo(null);
        super.setHasDescricao(true);
    }

    @Override
    protected Class<Filho> getEntityClass() {
        return Filho.class;
    }

    @Override
    protected String getDescricao(DFilho entidade) {
        return entidade.getDescricao();
    }

    @Override
    protected void setCodigo(DFilho entidade, Integer codigo) {
        entidade.setCodigo(codigo);
    }

    @Override
    protected void setDescricao(DFilho entidade, String descricao) {
        entidade.setDescricao(descricao);
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
        super.deveSubstituirVersao("tb_filho", "cdfilho");
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
            filhoRepository.deleteById(idCriado);
            Map<String, Object> id = new HashMap<>();
            id.put("cdfilho", idCriado);
            Lixeira lixeira = lixeiraRepository.findByEntidadeid(id);
            lixeiraRepository.deleteById(lixeira.getId());
        }
    }
}
