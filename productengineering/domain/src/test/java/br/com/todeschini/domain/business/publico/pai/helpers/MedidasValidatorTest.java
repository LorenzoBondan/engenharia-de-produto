package br.com.todeschini.domain.business.publico.pai.helpers;

import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.medidas.DMedidas;
import br.com.todeschini.domain.business.publico.medidas.api.MedidasService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MedidasValidatorTest {

    private MedidasService medidasService;
    private MedidasValidator validator;

    @BeforeEach
    void setup() {
        medidasService = mock(MedidasService.class);
        validator = new MedidasValidator(medidasService);
    }

    @Test
    void deveRetornarMedidaExistenteQuandoEncontrada() {
        DMedidas medida = new DMedidas();
        medida.setAltura(100);
        medida.setLargura(50);
        medida.setEspessura(15);

        DMedidas medidaExistente = new DMedidas();
        medidaExistente.setCodigo(1);
        medidaExistente.setAltura(100);
        medidaExistente.setLargura(50);
        medidaExistente.setEspessura(15);
        medidaExistente.setSituacao(DSituacaoEnum.ATIVO);

        when(medidasService.buscarPorAlturaELarguraEEspessura(100, 50, 15))
                .thenReturn((Collection) List.of(medidaExistente));

        DMedidas resultado = validator.verificarOuIncluir(medida);

        assertNotNull(resultado);
        assertEquals(1, resultado.getCodigo());
        assertEquals(DSituacaoEnum.ATIVO, resultado.getSituacao());
        verify(medidasService, times(1)).buscarPorAlturaELarguraEEspessura(100, 50, 15);
        verify(medidasService, never()).incluir(any());
    }

    @Test
    void deveIncluirNovaMedidaQuandoNaoExistir() {
        DMedidas medida = new DMedidas();
        medida.setAltura(100);
        medida.setLargura(50);
        medida.setEspessura(15);

        DMedidas medidaInserida = new DMedidas();
        medidaInserida.setCodigo(5);
        medidaInserida.setAltura(100);
        medidaInserida.setLargura(50);
        medidaInserida.setEspessura(15);

        when(medidasService.buscarPorAlturaELarguraEEspessura(100, 50, 15))
                .thenReturn(new ArrayList<>());
        when(medidasService.incluir(medida)).thenReturn(medidaInserida);

        DMedidas resultado = validator.verificarOuIncluir(medida);

        assertNotNull(resultado);
        assertEquals(5, resultado.getCodigo());
        verify(medidasService, times(1)).buscarPorAlturaELarguraEEspessura(100, 50, 15);
        verify(medidasService, times(1)).incluir(medida);
    }

    @Test
    void devePreservarSituacaoDaMedidaExistente() {
        DMedidas medida = new DMedidas();
        medida.setAltura(200);
        medida.setLargura(100);
        medida.setEspessura(18);

        DMedidas medidaExistente = new DMedidas();
        medidaExistente.setCodigo(10);
        medidaExistente.setAltura(200);
        medidaExistente.setLargura(100);
        medidaExistente.setEspessura(18);
        medidaExistente.setSituacao(DSituacaoEnum.INATIVO);

        when(medidasService.buscarPorAlturaELarguraEEspessura(200, 100, 18))
                .thenReturn((Collection) List.of(medidaExistente));

        DMedidas resultado = validator.verificarOuIncluir(medida);

        assertEquals(DSituacaoEnum.INATIVO, resultado.getSituacao());
    }
}
