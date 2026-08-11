package br.com.todeschini.webapi.config;

import br.com.todeschini.domain.business.processadores.MaterialProcessadorFactory;
import br.com.todeschini.domain.business.publico.acessorio.api.AcessorioService;
import br.com.todeschini.domain.business.publico.acessoriousado.api.AcessorioUsadoService;
import br.com.todeschini.domain.business.publico.categoriacomponente.api.CategoriaComponenteService;
import br.com.todeschini.domain.business.publico.cor.api.CorService;
import br.com.todeschini.domain.business.publico.filho.api.FilhoService;
import br.com.todeschini.domain.business.publico.maquina.api.MaquinaService;
import br.com.todeschini.domain.business.publico.material.api.MaterialService;
import br.com.todeschini.domain.business.publico.medidas.api.MedidasService;
import br.com.todeschini.domain.business.publico.modelo.api.ModeloService;
import br.com.todeschini.domain.business.publico.pai.builders.EstruturaPaiProcessor;
import br.com.todeschini.domain.business.publico.pai.builders.EstruturaModulacaoBuilder;
import br.com.todeschini.domain.business.publico.pai.facades.EstruturaServicesFacade;
import br.com.todeschini.domain.business.publico.pai.facades.MaterialServicesFacade;
import br.com.todeschini.domain.business.publico.pai.helpers.FilhoFactory;
import br.com.todeschini.domain.business.publico.pai.helpers.MedidasValidator;
import br.com.todeschini.domain.business.publico.pai.spi.CrudPai;
import br.com.todeschini.domain.business.publico.roteiro.api.RoteiroService;
import br.com.todeschini.domain.business.publico.roteiromaquina.api.RoteiroMaquinaService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PaiServiceConfig {

    @Bean
    public MaterialServicesFacade materialServicesFacade(
            MaterialService materialService,
            MaterialProcessadorFactory materialProcessadorFactory) {
        return new MaterialServicesFacade(materialService, materialProcessadorFactory);
    }

    @Bean
    public EstruturaServicesFacade estruturaServicesFacade(
            FilhoService filhoService,
            MedidasService medidasService,
            RoteiroService roteiroService,
            MaquinaService maquinaService,
            RoteiroMaquinaService roteiroMaquinaService,
            CorService corService,
            AcessorioService acessorioService,
            AcessorioUsadoService acessorioUsadoService,
            ModeloService modeloService,
            CategoriaComponenteService categoriaComponenteService) {
        return new EstruturaServicesFacade(
                filhoService,
                medidasService,
                roteiroService,
                maquinaService,
                roteiroMaquinaService,
                corService,
                acessorioService,
                acessorioUsadoService,
                modeloService,
                categoriaComponenteService
        );
    }

    @Bean
    public MedidasValidator medidasValidator(MedidasService medidasService) {
        return new MedidasValidator(medidasService);
    }

    @Bean
    public FilhoFactory filhoFactory(
            FilhoService filhoService,
            CorService corService,
            MaterialProcessadorFactory materialProcessadorFactory) {
        return new FilhoFactory(filhoService, corService, materialProcessadorFactory);
    }

    @Bean
    public EstruturaPaiProcessor estruturaPaiProcessor(
            CrudPai crudPai,
            EstruturaServicesFacade estruturaFacade,
            MaterialServicesFacade materialFacade,
            MedidasValidator medidasValidator,
            FilhoFactory filhoFactory) {
        return new EstruturaPaiProcessor(
                crudPai,
                estruturaFacade,
                materialFacade,
                medidasValidator,
                filhoFactory
        );
    }

    @Bean
    public EstruturaModulacaoBuilder estruturaModulacaoBuilder(
            EstruturaServicesFacade estruturaFacade,
            MaterialServicesFacade materialFacade,
            MedidasValidator medidasValidator,
            FilhoFactory filhoFactory,
            EstruturaPaiProcessor estruturaPaiProcessor) {
        return new EstruturaModulacaoBuilder(
                estruturaFacade,
                materialFacade,
                medidasValidator,
                filhoFactory,
                estruturaPaiProcessor
        );
    }
}
