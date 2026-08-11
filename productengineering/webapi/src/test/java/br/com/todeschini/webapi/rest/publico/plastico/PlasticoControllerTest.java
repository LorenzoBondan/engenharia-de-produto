package br.com.todeschini.webapi.rest.publico.plastico;

import br.com.todeschini.domain.business.publico.plastico.DPlastico;
import br.com.todeschini.domain.util.tests.PlasticoFactory;
import br.com.todeschini.persistence.entities.publico.Lixeira;
import br.com.todeschini.persistence.entities.publico.Plastico;
import br.com.todeschini.persistence.publico.history.HistoryRepository;
import br.com.todeschini.persistence.publico.lixeira.LixeiraRepository;
import br.com.todeschini.persistence.publico.plastico.PlasticoRepository;
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
public class PlasticoControllerTest extends BaseControllerTest<DPlastico, Plastico> {

    @Autowired
    private PlasticoRepository plasticoRepository;
    @Autowired
    private LixeiraRepository lixeiraRepository;

    @Autowired
    public PlasticoControllerTest(MockMvc mockMvc, ObjectMapper objectMapper, HistoryRepository historyRepository, TokenUtil tokenUtil) {
        super(mockMvc, objectMapper, historyRepository, tokenUtil);
        this.baseUrl = "/api/plastico";
    }

    @BeforeAll
    public void setUp() {
        // Initialize reference data (Cor, Categoria, Modelo, etc.)
        super.initializeTestData();

        novaEntidade = PlasticoFactory.createDPlastico();
        novaEntidade.setCodigo(null);
        super.setHasDescricao(true);
    }

    @Override
    protected Class<Plastico> getEntityClass() {
        return Plastico.class;
    }

    @Override
    protected String getDescricao(DPlastico entidade) {
        return entidade.getDescricao();
    }

    @Override
    protected void setCodigo(DPlastico entidade, Integer codigo) {
        entidade.setCodigo(codigo);
    }

    @Override
    protected void setDescricao(DPlastico entidade, String descricao) {
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
        super.deveSubstituirVersao("tb_material", "cdmaterial");
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
            plasticoRepository.deleteById(idCriado);
            Map<String, Object> id = new HashMap<>();
            id.put("cdmaterial", idCriado);
            Lixeira lixeira = lixeiraRepository.findByEntidadeid(id);
            lixeiraRepository.deleteById(lixeira.getId());
        }
    }
}
