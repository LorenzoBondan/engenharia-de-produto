package br.com.todeschini.webapi.rest.publico;

import br.com.todeschini.webapi.api.v1.rest.publico.acessorio.AcessorioController;
import br.com.todeschini.webapi.api.v1.rest.publico.acessoriousado.AcessorioUsadoController;
import br.com.todeschini.webapi.api.v1.rest.publico.baguete.BagueteController;
import br.com.todeschini.webapi.api.v1.rest.publico.cantoneira.CantoneiraController;
import br.com.todeschini.webapi.api.v1.rest.publico.categoriacomponente.CategoriaComponenteController;
import br.com.todeschini.webapi.api.v1.rest.publico.chapa.ChapaController;
import br.com.todeschini.webapi.api.v1.rest.publico.cola.ColaController;
import br.com.todeschini.webapi.api.v1.rest.publico.cor.CorController;
import br.com.todeschini.webapi.api.v1.rest.publico.filho.FilhoController;
import br.com.todeschini.webapi.api.v1.rest.publico.fitaborda.FitaBordaController;
import br.com.todeschini.webapi.api.v1.rest.publico.grupomaquina.GrupoMaquinaController;
import br.com.todeschini.webapi.api.v1.rest.publico.maquina.MaquinaController;
import br.com.todeschini.webapi.api.v1.rest.publico.material.MaterialController;
import br.com.todeschini.webapi.api.v1.rest.publico.materialusado.MaterialUsadoController;
import br.com.todeschini.webapi.api.v1.rest.publico.medidas.MedidasController;
import br.com.todeschini.webapi.api.v1.rest.publico.modelo.ModeloController;
import br.com.todeschini.webapi.api.v1.rest.publico.pai.PaiController;
import br.com.todeschini.webapi.api.v1.rest.publico.pintura.PinturaController;
import br.com.todeschini.webapi.api.v1.rest.publico.pinturabordafundo.PinturaBordaFundoController;
import br.com.todeschini.webapi.api.v1.rest.publico.plastico.PlasticoController;
import br.com.todeschini.webapi.api.v1.rest.publico.poliester.PoliesterController;
import br.com.todeschini.webapi.api.v1.rest.publico.polietileno.PolietilenoController;
import br.com.todeschini.webapi.api.v1.rest.publico.roteiro.RoteiroController;
import br.com.todeschini.webapi.api.v1.rest.publico.roteiromaquina.RoteiroMaquinaController;
import br.com.todeschini.webapi.api.v1.rest.publico.tnt.TntController;
import org.junit.jupiter.api.Test;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;

import java.lang.reflect.Method;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class ControllerTransactionalAnnotationTest {

    Class<?>[] controllers = {
            AcessorioController.class,
            AcessorioUsadoController.class,
            BagueteController.class,
            CantoneiraController.class,
            CategoriaComponenteController.class,
            ChapaController.class,
            ColaController.class,
            CorController.class,
            FilhoController.class,
            FitaBordaController.class,
            GrupoMaquinaController.class,
            MaquinaController.class,
            MaterialController.class,
            MaterialUsadoController.class,
            MedidasController.class,
            ModeloController.class,
            PaiController.class,
            PinturaController.class,
            PinturaBordaFundoController.class,
            PlasticoController.class,
            PoliesterController.class,
            PolietilenoController.class,
            RoteiroController.class,
            RoteiroMaquinaController.class,
            TntController.class
    };

    @Test
    public void testAllControllerMethodsHaveTransactionalAnnotation() {
        for (Class<?> controller : controllers) {
            Method[] methods = controller.getDeclaredMethods();
            for (Method method : methods) {
                if (method.getModifiers() == java.lang.reflect.Modifier.PUBLIC) { // cerifica se o metodo é público
                    boolean hasTransactional = method.isAnnotationPresent(Transactional.class); // verifica se possui a anotação @Transactional
                    assertTrue(
                            hasTransactional,
                            "O método " + method.getName() + " da classe " + controller.getSimpleName() + " não possui a anotação @Transactional."
                    );
                }
            }
        }
    }

    @Test
    public void testGetMappingMethodsHaveTransactionalReadOnlyTrue() {
        for (Class<?> controller : controllers) {
            Method[] methods = controller.getDeclaredMethods();
            for (Method method : methods) {
                if (method.isAnnotationPresent(GetMapping.class)) {
                    // Verifica se o método possui @Transactional com readOnly = true
                    Transactional transactional = method.getAnnotation(Transactional.class);
                    assertTrue(
                            transactional != null && transactional.readOnly(),
                            "O método " + method.getName() + " da classe " + controller.getSimpleName() +
                                    " está anotado com @GetMapping mas não tem @Transactional com readOnly = true."
                    );
                }
            }
        }
    }

    @Test
    public void testNonGetMappingMethodsDoNotHaveTransactionalReadOnlyTrue() {
        for (Class<?> controller : controllers) {
            Method[] methods = controller.getDeclaredMethods();
            for (Method method : methods) {
                if (!method.isAnnotationPresent(GetMapping.class)) {
                    // Verifica se o método possui @Transactional e, se sim, readOnly não deve ser true
                    Transactional transactional = method.getAnnotation(Transactional.class);
                    if (transactional != null) {
                        assertFalse(
                                transactional.readOnly(),
                                "O método " + method.getName() + " da classe " + controller.getSimpleName() +
                                        " não está anotado com @GetMapping mas tem @Transactional com readOnly = true."
                        );
                    }
                }
            }
        }
    }
}
