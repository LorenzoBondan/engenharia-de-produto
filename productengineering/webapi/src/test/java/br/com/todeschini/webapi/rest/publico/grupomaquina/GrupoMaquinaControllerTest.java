package br.com.todeschini.webapi.rest.publico.grupomaquina;

import br.com.todeschini.domain.business.publico.grupomaquina.DGrupoMaquina;
import br.com.todeschini.domain.util.tests.GrupoMaquinaFactory;
import br.com.todeschini.persistence.entities.publico.GrupoMaquina;
import br.com.todeschini.persistence.entities.publico.Lixeira;
import br.com.todeschini.persistence.publico.grupomaquina.GrupoMaquinaRepository;
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
public class GrupoMaquinaControllerTest extends BaseControllerTest<DGrupoMaquina, GrupoMaquina> {

    @Autowired
    private GrupoMaquinaRepository grupoMaquinaRepository;
    @Autowired
    private LixeiraRepository lixeiraRepository;

    @Autowired
    public GrupoMaquinaControllerTest(MockMvc mockMvc, ObjectMapper objectMapper, HistoryRepository historyRepository, TokenUtil tokenUtil) {
        super(mockMvc, objectMapper, historyRepository, tokenUtil);
        this.baseUrl = "/api/grupomaquina";
    }

    @BeforeAll
    public void setUp() {
        // Initialize reference data (Cor, Categoria, Modelo, etc.)
        super.initializeTestData();

        novaEntidade = GrupoMaquinaFactory.createDGrupoMaquina();
        novaEntidade.setCodigo(null);
        super.setHasDescricao(true);
    }

    @Override
    protected Class<GrupoMaquina> getEntityClass() {
        return GrupoMaquina.class;
    }

    @Override
    protected String getDescricao(DGrupoMaquina entidade) {
        return entidade.getDescricao();
    }

    @Override
    protected void setCodigo(DGrupoMaquina entidade, Integer codigo) {
        entidade.setCodigo(codigo);
    }

    @Override
    protected void setDescricao(DGrupoMaquina entidade, String descricao) {
        entidade.setNome(descricao);
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
        super.deveSubstituirVersao("tb_grupo_maquina", "cdgrupo_maquina");
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
            grupoMaquinaRepository.deleteById(idCriado);
            Map<String, Object> id = new HashMap<>();
            id.put("cdgrupoMaquina", idCriado);
            Lixeira lixeira = lixeiraRepository.findByEntidadeid(id);
            lixeiraRepository.deleteById(lixeira.getId());
        }
    }
}
