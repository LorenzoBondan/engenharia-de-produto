package br.com.todeschini.domain.business.publico.pai.builders;

import br.com.todeschini.domain.business.enums.DTipoFilhoEnum;
import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.processadores.MaterialProcessador;
import br.com.todeschini.domain.business.publico.cor.DCor;
import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.maquina.DMaquina;
import br.com.todeschini.domain.business.publico.material.DMaterial;
import br.com.todeschini.domain.business.publico.medidas.DMedidas;
import br.com.todeschini.domain.business.publico.pai.DPai;
import br.com.todeschini.domain.business.publico.pai.facades.EstruturaServicesFacade;
import br.com.todeschini.domain.business.publico.pai.facades.MaterialServicesFacade;
import br.com.todeschini.domain.business.publico.pai.helpers.FilhoFactory;
import br.com.todeschini.domain.business.publico.pai.helpers.MedidasValidator;
import br.com.todeschini.domain.business.publico.pai.montadores.DMontadorEstruturaPai;
import br.com.todeschini.domain.business.publico.pai.spi.CrudPai;
import br.com.todeschini.domain.business.publico.roteiro.DRoteiro;
import br.com.todeschini.domain.business.publico.roteiromaquina.DRoteiroMaquina;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class EstruturaPaiProcessor {

    private final CrudPai crudPai;
    private final EstruturaServicesFacade estruturaFacade;
    private final MaterialServicesFacade materialFacade;
    private final MedidasValidator medidasValidator;
    private final FilhoFactory filhoFactory;

    public EstruturaPaiProcessor(
            CrudPai crudPai,
            EstruturaServicesFacade estruturaFacade,
            MaterialServicesFacade materialFacade,
            MedidasValidator medidasValidator,
            FilhoFactory filhoFactory) {
        this.crudPai = crudPai;
        this.estruturaFacade = estruturaFacade;
        this.materialFacade = materialFacade;
        this.medidasValidator = medidasValidator;
        this.filhoFactory = filhoFactory;
    }

    public DPai montarPai(DMontadorEstruturaPai montador) {
        DPai pai = DPai.builder()
                .modelo(estruturaFacade.getModeloService().buscar(montador.getModelo().getCodigo()))
                .categoriaComponente(estruturaFacade.getCategoriaComponenteService()
                        .buscar(montador.getCategoriaComponente().getCodigo()))
                .bordasComprimento(montador.getBordasComprimento())
                .bordasLargura(montador.getBordasLargura())
                .numeroCantoneiras(montador.getNumeroCantoneiras())
                .tntUmaFace(montador.getTntUmaFace())
                .plasticoAcima(montador.getPlasticoAcima())
                .plasticoAdicional(montador.getPlasticoAdicional())
                .larguraPlastico(montador.getLarguraPlastico())
                .tipoPintura(montador.getTipoPintura())
                .faces(montador.getFaces())
                .especial(montador.getEspecial())
                .filhos(new ArrayList<>())
                .build();

        pai.gerarDescricao();
        pai.validar();
        return pai;
    }

    public DPai incluirPai(DPai pai) {
        return crudPai.inserir(pai);
    }

    public DPai atualizarPai(DPai pai) {
        return crudPai.atualizar(pai);
    }

    public DPai montarEstrutura(DMontadorEstruturaPai montador) {
        DPai pai = montarPai(montador);
        pai = incluirPai(pai);
        processarMedidasEFilhos(montador, pai);
        return atualizarPai(pai);
    }

    public void processarMedidasEFilhos(DMontadorEstruturaPai montador, DPai pai) {
        for (DMedidas medida : montador.getMedidas()) {
            medida = medidasValidator.verificarOuIncluir(medida);

            for (DCor cor : montador.getCores()) {
                DFilho filho = estruturaFacade.getFilhoService().incluir(
                        filhoFactory.criarFilho(pai, pai.getDescricao(), cor, medida,
                                montador.getImplantacao(), montador.getTipoFilho())
                );

                processarFilhoComMateriais(montador, filho);
                processarRoteiro(filho, pai.getDescricao(), medida, montador.getMaquinas(), montador.getImplantacao());

                estruturaFacade.getFilhoService().atualizar(filho);
                pai.getFilhos().add(filho);
            }
        }
    }

    private void processarFilhoComMateriais(DMontadorEstruturaPai montador, DFilho filho) {
        if (filho.getTipo().equals(DTipoFilhoEnum.MDP)) {
            processarMateriaisMDP(filho, montador.getMateriais());
        } else if (filho.getTipo().equals(DTipoFilhoEnum.MDF)) {
            processarMateriaisMDF(filho, montador.getMateriais());
        }
    }

    private void processarMateriaisMDP(DFilho filho, List<DMaterial> materiais) {
        MaterialProcessador chapaMDPProcessador = materialFacade.getMaterialProcessadorFactory()
                .getProcessador(DTipoMaterialEnum.CHAPA_MDP.toString());
        chapaMDPProcessador.processarMaterial(filho, null);

        MaterialProcessador fitaBordaProcessador = materialFacade.getMaterialProcessadorFactory()
                .getProcessador(DTipoMaterialEnum.FITA_BORDA.toString());
        fitaBordaProcessador.processarMaterial(filho, null);

        if (materiais != null) {
            for (DMaterial material : materiais) {
                material = materialFacade.getMaterialService().buscar(material.getCodigo());
                MaterialProcessador processador = materialFacade.getMaterialProcessadorFactory()
                        .getProcessador(material.getTipoMaterial().name());
                processador.processarMaterial(filho, material);
            }
        }
    }

    private void processarMateriaisMDF(DFilho filho, List<DMaterial> materiais) {
        DFilho fundo = filhoFactory.criarFundo(filho);
        filho.getFilhos().add(fundo);

        MaterialProcessador pinturaProcessador = materialFacade.getMaterialProcessadorFactory()
                .getProcessador(DTipoMaterialEnum.PINTURA.toString());
        pinturaProcessador.processarMaterial(filho, null);

        if (materiais != null) {
            for (DMaterial material : materiais) {
                material = materialFacade.getMaterialService().buscar(material.getCodigo());
                MaterialProcessador processador = materialFacade.getMaterialProcessadorFactory()
                        .getProcessador(material.getTipoMaterial().name());
                processador.processarMaterial(filho, material);
            }
        }
    }

    private void processarRoteiro(DFilho filho, String descricao, DMedidas medida, List<DMaquina> maquinas, LocalDate implantacao) {
        if (maquinas == null || maquinas.isEmpty()) {
            return;
        }

        String roteiroDescricao = descricao + " - " + medida.getAltura() + "X" + medida.getLargura() + "X" + medida.getEspessura();

        DRoteiro roteiro = estruturaFacade.getRoteiroService().existePorDescricao(roteiroDescricao)
                ? estruturaFacade.getRoteiroService().buscarPorDescricao(roteiroDescricao).iterator().next()
                : criarNovoRoteiro(roteiroDescricao, medida, maquinas, implantacao);

        filho.setRoteiro(roteiro);
    }

    private DRoteiro criarNovoRoteiro(String descricao, DMedidas medida, List<DMaquina> maquinas, LocalDate implantacao) {
        DRoteiro roteiro = new DRoteiro();
        roteiro.setDescricao(descricao);
        roteiro.setImplantacao(implantacao);
        roteiro = estruturaFacade.getRoteiroService().incluir(roteiro);

        for (DMaquina maquina : maquinas) {
            maquina = estruturaFacade.getMaquinaService().buscar(maquina.getCodigo());
            DRoteiroMaquina roteiroMaquina = new DRoteiroMaquina();
            roteiroMaquina.setRoteiro(roteiro);
            roteiroMaquina.setMaquina(maquina);
            roteiroMaquina.calcularTempo(medida.getAltura(), medida.getLargura(), medida.getEspessura());
            roteiroMaquina.setUnidadeMedida("MIN");
            roteiroMaquina = estruturaFacade.getRoteiroMaquinaService().incluir(roteiroMaquina);
            roteiro.getRoteiroMaquinas().add(roteiroMaquina);
        }

        return estruturaFacade.getRoteiroService().buscar(roteiro.getCodigo());
    }
}
