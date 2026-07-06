package br.com.todeschini.domain.business.publico.pai.helpers;

import br.com.todeschini.domain.business.enums.DTipoFilhoEnum;
import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.processadores.MaterialProcessador;
import br.com.todeschini.domain.business.processadores.MaterialProcessadorFactory;
import br.com.todeschini.domain.business.publico.cor.DCor;
import br.com.todeschini.domain.business.publico.cor.api.CorService;
import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.filho.api.FilhoService;
import br.com.todeschini.domain.business.publico.medidas.DMedidas;
import br.com.todeschini.domain.business.publico.pai.DPai;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FilhoFactoryTest {

    private FilhoService filhoService;
    private CorService corService;
    private MaterialProcessadorFactory materialProcessadorFactory;
    private FilhoFactory factory;

    @BeforeEach
    void setup() {
        filhoService = mock(FilhoService.class);
        corService = mock(CorService.class);
        materialProcessadorFactory = mock(MaterialProcessadorFactory.class);
        factory = new FilhoFactory(filhoService, corService, materialProcessadorFactory);
    }

    @Test
    void deveCriarFilhoComAtributosCorretos() {
        DPai pai = new DPai();
        pai.setCodigo(1);
        pai.setDescricao("Pai Teste");

        DCor cor = new DCor();
        cor.setCodigo(1);
        cor.setDescricao("Branco");

        DMedidas medidas = new DMedidas();
        medidas.setCodigo(1);
        medidas.setAltura(100);
        medidas.setLargura(50);
        medidas.setEspessura(15);

        LocalDate implantacao = LocalDate.now();

        DFilho filho = factory.criarFilho(pai, "Filho Teste", cor, medidas, implantacao, DTipoFilhoEnum.MDP);

        assertNotNull(filho);
        assertNull(filho.getCodigo());
        assertEquals("Filho Teste", filho.getDescricao());
        assertEquals(pai, filho.getPai());
        assertEquals(cor, filho.getCor());
        assertEquals(medidas, filho.getMedidas());
        assertNull(filho.getRoteiro());
        assertEquals("UN", filho.getUnidadeMedida());
        assertEquals(implantacao, filho.getImplantacao());
        assertNull(filho.getValor());
        assertEquals(DTipoFilhoEnum.MDP, filho.getTipo());
        assertNotNull(filho.getMateriaisUsados());
        assertNotNull(filho.getFilhos());
        assertNotNull(filho.getAcessoriosUsados());
    }

    @Test
    void deveCriarFundoQuandoNaoExistir() {
        DPai pai = new DPai();
        pai.setCodigo(1);

        DMedidas medidas = new DMedidas();
        medidas.setCodigo(1);
        medidas.setAltura(100);
        medidas.setLargura(50);
        medidas.setEspessura(15);

        DFilho filho = new DFilho();
        filho.setDescricao("Filho Original");
        filho.setPai(pai);
        filho.setMedidas(medidas);
        filho.setImplantacao(LocalDate.now());

        DCor corFundo = new DCor();
        corFundo.setCodigo(4);
        corFundo.setDescricao("Cor Fundo");

        DFilho fundoCriado = new DFilho();
        fundoCriado.setCodigo(10);
        fundoCriado.setDescricao("Fundo Filho Original 100.0X50.0X15.0");

        MaterialProcessador processador = mock(MaterialProcessador.class);

        when(filhoService.pesquisarPorDescricaoEMedidas(anyString(), eq(1))).thenReturn(new ArrayList<>());
        when(corService.buscar(4)).thenReturn(corFundo);
        when(filhoService.incluir(any(DFilho.class))).thenReturn(fundoCriado);
        when(materialProcessadorFactory.getProcessador(DTipoMaterialEnum.CHAPA_MDF.toString())).thenReturn(processador);
        doNothing().when(processador).processarMaterial(any(), any());
        when(filhoService.atualizar(any())).thenReturn(fundoCriado);

        DFilho fundo = factory.criarFundo(filho);

        assertNotNull(fundo);
        assertEquals(10, fundo.getCodigo());
        verify(filhoService, times(1)).incluir(any(DFilho.class));
        verify(filhoService, times(1)).atualizar(any(DFilho.class));
        verify(materialProcessadorFactory, times(1)).getProcessador(DTipoMaterialEnum.CHAPA_MDF.toString());
    }

    @Test
    void deveRetornarFundoExistenteQuandoJaExistir() {
        DPai pai = new DPai();
        pai.setCodigo(1);

        DMedidas medidas = new DMedidas();
        medidas.setCodigo(1);
        medidas.setAltura(100);
        medidas.setLargura(50);
        medidas.setEspessura(15);

        DFilho filho = new DFilho();
        filho.setDescricao("Filho Original");
        filho.setPai(pai);
        filho.setMedidas(medidas);
        filho.setImplantacao(LocalDate.now());

        DFilho fundoExistente = new DFilho();
        fundoExistente.setCodigo(20);
        fundoExistente.setDescricao("Fundo Filho Original 100.0X50.0X15.0");

        when(filhoService.pesquisarPorDescricaoEMedidas(anyString(), eq(1)))
                .thenReturn(List.of(fundoExistente));

        DFilho fundo = factory.criarFundo(filho);

        assertNotNull(fundo);
        assertEquals(20, fundo.getCodigo());
        verify(filhoService, times(1)).pesquisarPorDescricaoEMedidas(anyString(), eq(1));
        verify(filhoService, never()).incluir(any());
        verify(corService, never()).buscar(anyInt());
    }

    @Test
    void deveCriarFilhoComListasVazias() {
        DPai pai = new DPai();
        DCor cor = new DCor();
        DMedidas medidas = new DMedidas();

        DFilho filho = factory.criarFilho(pai, "Teste", cor, medidas, LocalDate.now(), DTipoFilhoEnum.MDF);

        assertTrue(filho.getMateriaisUsados().isEmpty());
        assertTrue(filho.getFilhos().isEmpty());
        assertTrue(filho.getAcessoriosUsados().isEmpty());
    }
}
