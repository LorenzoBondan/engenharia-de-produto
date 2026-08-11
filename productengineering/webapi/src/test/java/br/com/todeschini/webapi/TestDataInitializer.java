package br.com.todeschini.webapi;

import br.com.todeschini.persistence.publico.acessorio.AcessorioRepository;
import br.com.todeschini.persistence.publico.categoriacomponente.CategoriaComponenteRepository;
import br.com.todeschini.persistence.publico.chapa.ChapaRepository;
import br.com.todeschini.persistence.publico.cor.CorRepository;
import br.com.todeschini.persistence.publico.filho.FilhoRepository;
import br.com.todeschini.persistence.publico.grupomaquina.GrupoMaquinaRepository;
import br.com.todeschini.persistence.publico.maquina.MaquinaRepository;
import br.com.todeschini.persistence.publico.medidas.MedidasRepository;
import br.com.todeschini.persistence.publico.modelo.ModeloRepository;
import br.com.todeschini.persistence.publico.pai.PaiRepository;
import br.com.todeschini.persistence.publico.roteiro.RoteiroRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Collections;

/**
 * Initializes reference data for tests.
 * This class creates minimal required reference entities that are used by test Factories.
 * Called once per test class in @BeforeAll.
 */
@Component
public class TestDataInitializer {

    // Removed static initialized flag to allow re-initialization per test class
    // Each test class has its own H2 database instance with create-drop

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private CorRepository corRepository;

    @Autowired
    private CategoriaComponenteRepository categoriaComponenteRepository;

    @Autowired
    private ModeloRepository modeloRepository;

    @Autowired
    private GrupoMaquinaRepository grupoMaquinaRepository;

    @Autowired
    private MaquinaRepository maquinaRepository;

    @Autowired
    private MedidasRepository medidasRepository;

    @Autowired
    private RoteiroRepository roteiroRepository;

    @Autowired
    private PaiRepository paiRepository;

    @Autowired
    private FilhoRepository filhoRepository;

    @Autowired
    private AcessorioRepository acessorioRepository;

    @Autowired
    private ChapaRepository chapaRepository;

    /**
     * Initializes reference data for tests.
     * Uses @Transactional to ensure all inserts are in a single transaction.
     * Uses native SQL to insert records with specific IDs (bypassing GeneratedValue).
     */
    @Transactional
    public synchronized void initializeReferenceData() {

        // Set up security context for auditing with mock JWT
        Jwt jwt = Jwt.withTokenValue("test-token")
                .header("alg", "none")
                .claim("username", "test@test.com")
                .claim("sub", "test@test.com")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(3600))
                .build();

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        jwt,
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
                );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // IMPORTANT: Using high IDs (100+) to avoid conflicts with auto-increment in controller tests

        // Create Cor (ID=100) - used by multiple Factories
        // Using native SQL to bypass @GeneratedValue and insert with specific ID
        if (corRepository.findById(100).isEmpty()) {
            entityManager.createNativeQuery(
                "INSERT INTO tb_cor (cdcor, descricao, hexa, situacao, criadoem, criadopor) " +
                "VALUES (100, 'COR_TESTE_REF', 'FFFFFF', 'ATIVO', CURRENT_TIMESTAMP, 'test@test.com')"
            ).executeUpdate();
            entityManager.flush();
        }

        // Create CategoriaComponente (ID=100) - used by Pai/Filho Factories
        if (categoriaComponenteRepository.findById(100).isEmpty()) {
            entityManager.createNativeQuery(
                "INSERT INTO tb_categoria_componente (cdcategoria_componente, descricao, situacao, criadoem, criadopor) " +
                "VALUES (100, 'CATEGORIA_TESTE_REF', 'ATIVO', CURRENT_TIMESTAMP, 'test@test.com')"
            ).executeUpdate();
            entityManager.flush();
        }

        // Create Modelo (ID=100) - used by Pai Factories
        if (modeloRepository.findById(100).isEmpty()) {
            entityManager.createNativeQuery(
                "INSERT INTO tb_modelo (cdmodelo, descricao, situacao, criadoem, criadopor) " +
                "VALUES (100, 'MODELO_TESTE_REF', 'ATIVO', CURRENT_TIMESTAMP, 'test@test.com')"
            ).executeUpdate();
            entityManager.flush();
        }

        // Create GrupoMaquina (ID=100) - used by Maquina
        if (grupoMaquinaRepository.findById(100).isEmpty()) {
            entityManager.createNativeQuery(
                "INSERT INTO tb_grupo_maquina (cdgrupo_maquina, nome, situacao, criadoem, criadopor) " +
                "VALUES (100, 'GRUPO_TESTE_REF', 'ATIVO', CURRENT_TIMESTAMP, 'test@test.com')"
            ).executeUpdate();
            entityManager.flush();
        }

        // Create Maquina (ID=100) - requires GrupoMaquina
        if (maquinaRepository.findById(100).isEmpty()) {
            entityManager.createNativeQuery(
                "INSERT INTO tb_maquina (cdmaquina, nome, formula, valor, cdgrupo_maquina, situacao, criadoem, criadopor) " +
                "VALUES (100, 'MAQUINA_TESTE_REF', 'M100', 1.0, 100, 'ATIVO', CURRENT_TIMESTAMP, 'test@test.com')"
            ).executeUpdate();
            entityManager.flush();
        }

        // Create Medidas (ID=100) - used by multiple Factories
        if (medidasRepository.findById(100).isEmpty()) {
            entityManager.createNativeQuery(
                "INSERT INTO tb_medidas (cdmedidas, altura, largura, espessura, situacao, criadoem, criadopor) " +
                "VALUES (100, 1, 1, 1, 'ATIVO', CURRENT_TIMESTAMP, 'test@test.com')"
            ).executeUpdate();
            entityManager.flush();
        }

        // Create Roteiro (ID=100) - used by Filho/RoteiroMaquina Factories
        if (roteiroRepository.findById(100).isEmpty()) {
            entityManager.createNativeQuery(
                "INSERT INTO tb_roteiro (cdroteiro, descricao, situacao, criadoem, criadopor) " +
                "VALUES (100, 'ROTEIRO_TESTE_REF', 'ATIVO', CURRENT_TIMESTAMP, 'test@test.com')"
            ).executeUpdate();
            entityManager.flush();
        }

        // Create Pai (ID=100) - requires Modelo, CategoriaComponente - used by Filho Factory
        if (paiRepository.findById(100).isEmpty()) {
            entityManager.createNativeQuery(
                "INSERT INTO tb_pai (cdpai, cdmodelo, cdcategoria_componente, descricao, bordas_comprimento, bordas_largura, " +
                "numero_cantoneiras, tnt_uma_face, largura_plastico, plastico_acima, plastico_adicional, situacao, criadoem, criadopor) " +
                "VALUES (100, 100, 100, 'PAI_TESTE_REF', 1, 1, 4, true, 100, true, 100.0, 'ATIVO', CURRENT_TIMESTAMP, 'test@test.com')"
            ).executeUpdate();
            entityManager.flush();
        }

        // Create Filho (ID=100) - requires Pai, Cor, Medidas, Roteiro - used by AcessorioUsado/MaterialUsado Factories
        if (filhoRepository.findById(100).isEmpty()) {
            entityManager.createNativeQuery(
                "INSERT INTO tb_filho (cdfilho, cdpai, cdcor, cdmedidas, cdroteiro, descricao, situacao, criadoem, criadopor) " +
                "VALUES (100, 100, 100, 100, 100, 'FILHO_TESTE_REF', 'ATIVO', CURRENT_TIMESTAMP, 'test@test.com')"
            ).executeUpdate();
            entityManager.flush();
        }

        // Create Acessorio (ID=100) - requires Cor, Medidas - used by AcessorioUsado Factory
        if (acessorioRepository.findById(100).isEmpty()) {
            entityManager.createNativeQuery(
                "INSERT INTO tb_acessorio (cdacessorio, cdcor, cdmedidas, descricao, situacao, criadoem, criadopor) " +
                "VALUES (100, 100, 100, 'ACESSORIO_TESTE_REF', 'ATIVO', CURRENT_TIMESTAMP, 'test@test.com')"
            ).executeUpdate();
            entityManager.flush();
        }

        // Create Chapa as Material(100) and Material(101) - requires Cor - used by MaterialUsado Factory
        // Note: tipo_material is INTEGER - 1 = CHAPA_MDP (from TipoMaterialEnum.getValue())
        // Note: dtype is discriminator for SINGLE_TABLE inheritance - 'Chapa' identifies the subclass
        if (chapaRepository.findById(100).isEmpty()) {
            entityManager.createNativeQuery(
                "INSERT INTO tb_material (cdmaterial, cdcor, descricao, valor, situacao, criadoem, criadopor, tipo_material, dtype) " +
                "VALUES (100, 100, 'MATERIAL_TESTE_REF_1', 100.0, 'ATIVO', CURRENT_TIMESTAMP, 'test@test.com', 1, 'Chapa')"
            ).executeUpdate();
            entityManager.flush();
        }

        if (chapaRepository.findById(101).isEmpty()) {
            entityManager.createNativeQuery(
                "INSERT INTO tb_material (cdmaterial, cdcor, descricao, valor, situacao, criadoem, criadopor, tipo_material, dtype) " +
                "VALUES (101, 100, 'MATERIAL_TESTE_REF_2', 200.0, 'ATIVO', CURRENT_TIMESTAMP, 'test@test.com', 1, 'Chapa')"
            ).executeUpdate();
            entityManager.flush();
        }
    }
}
