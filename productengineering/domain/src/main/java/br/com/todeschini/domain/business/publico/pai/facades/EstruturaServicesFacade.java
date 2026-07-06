package br.com.todeschini.domain.business.publico.pai.facades;

import br.com.todeschini.domain.business.publico.acessorio.api.AcessorioService;
import br.com.todeschini.domain.business.publico.acessoriousado.api.AcessorioUsadoService;
import br.com.todeschini.domain.business.publico.categoriacomponente.api.CategoriaComponenteService;
import br.com.todeschini.domain.business.publico.cor.api.CorService;
import br.com.todeschini.domain.business.publico.filho.api.FilhoService;
import br.com.todeschini.domain.business.publico.maquina.api.MaquinaService;
import br.com.todeschini.domain.business.publico.medidas.api.MedidasService;
import br.com.todeschini.domain.business.publico.modelo.api.ModeloService;
import br.com.todeschini.domain.business.publico.roteiro.api.RoteiroService;
import br.com.todeschini.domain.business.publico.roteiromaquina.api.RoteiroMaquinaService;

public class EstruturaServicesFacade {

    private final FilhoService filhoService;
    private final MedidasService medidasService;
    private final RoteiroService roteiroService;
    private final MaquinaService maquinaService;
    private final RoteiroMaquinaService roteiroMaquinaService;
    private final CorService corService;
    private final AcessorioService acessorioService;
    private final AcessorioUsadoService acessorioUsadoService;
    private final ModeloService modeloService;
    private final CategoriaComponenteService categoriaComponenteService;

    public EstruturaServicesFacade(
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
        this.filhoService = filhoService;
        this.medidasService = medidasService;
        this.roteiroService = roteiroService;
        this.maquinaService = maquinaService;
        this.roteiroMaquinaService = roteiroMaquinaService;
        this.corService = corService;
        this.acessorioService = acessorioService;
        this.acessorioUsadoService = acessorioUsadoService;
        this.modeloService = modeloService;
        this.categoriaComponenteService = categoriaComponenteService;
    }

    public FilhoService getFilhoService() {
        return filhoService;
    }

    public MedidasService getMedidasService() {
        return medidasService;
    }

    public RoteiroService getRoteiroService() {
        return roteiroService;
    }

    public MaquinaService getMaquinaService() {
        return maquinaService;
    }

    public RoteiroMaquinaService getRoteiroMaquinaService() {
        return roteiroMaquinaService;
    }

    public CorService getCorService() {
        return corService;
    }

    public AcessorioService getAcessorioService() {
        return acessorioService;
    }

    public AcessorioUsadoService getAcessorioUsadoService() {
        return acessorioUsadoService;
    }

    public ModeloService getModeloService() {
        return modeloService;
    }

    public CategoriaComponenteService getCategoriaComponenteService() {
        return categoriaComponenteService;
    }
}
