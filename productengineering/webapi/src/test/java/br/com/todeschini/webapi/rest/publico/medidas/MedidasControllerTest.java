package br.com.todeschini.webapi.rest.publico.medidas;

import br.com.todeschini.domain.business.publico.medidas.DMedidas;
import br.com.todeschini.domain.util.tests.MedidasFactory;
import br.com.todeschini.persistence.entities.publico.Lixeira;
import br.com.todeschini.persistence.entities.publico.Medidas;
import br.com.todeschini.persistence.publico.history.HistoryRepository;
import br.com.todeschini.persistence.publico.lixeira.LixeiraRepository;
import br.com.todeschini.persistence.publico.medidas.MedidasRepository;
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
public class MedidasControllerTest extends BaseControllerTest<DMedidas, Medidas> {

    @Autowired
    private MedidasRepository medidasRepository;
    @Autowired
    private LixeiraRepository lixeiraRepository;

    @Autowired
    public MedidasControllerTest(MockMvc mockMvc, ObjectMapper objectMapper, HistoryRepository historyRepository, TokenUtil tokenUtil) {
        super(mockMvc, objectMapper, historyRepository, tokenUtil);
        this.baseUrl = "/api/medidas";
    }

    @BeforeAll
    public void setUp() {
        // Initialize reference data (Cor, Categoria, Modelo, etc.)
        super.initializeTestData();

        novaEntidade = MedidasFactory.createDMedidas();
        novaEntidade.setCodigo(null);
        super.setHasDescricao(false);
    }

    @Override
    protected Class<Medidas> getEntityClass() {
        return Medidas.class;
    }

    @Override
    protected String getDescricao(DMedidas entidade) {
        return entidade.getDescricao();
    }

    @Override
    protected void setCodigo(DMedidas entidade, Integer codigo) {
        entidade.setCodigo(codigo);
    }

    @Override
    protected void setDescricao(DMedidas entidade, String descricao) {
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
        super.deveSubstituirVersao("tb_medidas", "cdmedidas");
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
            medidasRepository.deleteById(idCriado);
            Map<String, Object> id = new HashMap<>();
            id.put("cdmedidas", idCriado);
            Lixeira lixeira = lixeiraRepository.findByEntidadeid(id);
            lixeiraRepository.deleteById(lixeira.getId());
        }
    }
}
