package br.com.todeschini.domain.business.publico.pai.builders;

import br.com.todeschini.domain.business.enums.DTipoFilhoEnum;
import br.com.todeschini.domain.business.publico.acessoriousado.DAcessorioUsado;
import br.com.todeschini.domain.business.publico.cor.DCor;
import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.medidas.DMedidas;
import br.com.todeschini.domain.business.publico.pai.DPai;
import br.com.todeschini.domain.business.publico.pai.facades.EstruturaServicesFacade;
import br.com.todeschini.domain.business.publico.pai.facades.MaterialServicesFacade;
import br.com.todeschini.domain.business.publico.pai.helpers.FilhoFactory;
import br.com.todeschini.domain.business.publico.pai.helpers.MedidasValidator;
import br.com.todeschini.domain.business.publico.pai.montadores.DAcessorioQuantidade;
import br.com.todeschini.domain.business.publico.pai.montadores.DItemModulacao;
import br.com.todeschini.domain.business.publico.pai.montadores.DMontadorEstruturaPai;
import br.com.todeschini.domain.business.publico.pai.montadores.DMontadorEstruturaPaiModulacao;

import java.util.*;

public class EstruturaModulacaoBuilder {

    private final EstruturaServicesFacade estruturaFacade;
    private final MaterialServicesFacade materialFacade;
    private final MedidasValidator medidasValidator;
    private final FilhoFactory filhoFactory;
    private final EstruturaPaiProcessor estruturaPaiProcessor;

    public EstruturaModulacaoBuilder(
            EstruturaServicesFacade estruturaFacade,
            MaterialServicesFacade materialFacade,
            MedidasValidator medidasValidator,
            FilhoFactory filhoFactory,
            EstruturaPaiProcessor estruturaPaiProcessor) {
        this.estruturaFacade = estruturaFacade;
        this.materialFacade = materialFacade;
        this.medidasValidator = medidasValidator;
        this.filhoFactory = filhoFactory;
        this.estruturaPaiProcessor = estruturaPaiProcessor;
    }

    public DPai construir(DMontadorEstruturaPaiModulacao montadorModulacao) {
        DPai paiPrincipal = criarPaiPrincipal(montadorModulacao);
        Map<String, DPai> paisCriados = new HashMap<>();

        processarPaisSecundarios(montadorModulacao, paiPrincipal, paisCriados);

        return paiPrincipal;
    }

    private DPai criarPaiPrincipal(DMontadorEstruturaPaiModulacao montadorModulacao) {
        DMontadorEstruturaPai montadorPrincipal = new DMontadorEstruturaPai(
                montadorModulacao.getPaiPrincipal().getModelo(),
                montadorModulacao.getPaiPrincipal().getCategoriaComponente(),
                montadorModulacao.getCores(),
                new ArrayList<>(Collections.singletonList(montadorModulacao.getMedidasPaiPrincipal())),
                montadorModulacao.getImplantacao(),
                DTipoFilhoEnum.MDP
        );

        DPai paiPrincipal = estruturaPaiProcessor.montarPai(montadorPrincipal);
        paiPrincipal = estruturaFacade.getModeloService().buscar(paiPrincipal.getModelo().getCodigo()) != null
                ? estruturaPaiProcessor.incluirPai(paiPrincipal)
                : paiPrincipal;

        processarMedidasEFilhosPaiPrincipal(montadorPrincipal, paiPrincipal);

        return paiPrincipal;
    }

    private void processarMedidasEFilhosPaiPrincipal(DMontadorEstruturaPai montador, DPai pai) {
        List<DMedidas> medidas = montador.getMedidas();
        for (int i = 0; i < medidas.size(); i++) {
            DMedidas medida = medidasValidator.verificarOuIncluir(medidas.get(i));

            for (DCor cor : montador.getCores()) {
                DFilho filho = estruturaFacade.getFilhoService().incluir(
                        filhoFactory.criarFilho(pai, pai.getDescricao(), cor, medida,
                                montador.getImplantacao(), montador.getTipoFilho())
                );

                estruturaFacade.getFilhoService().atualizar(filho);
                pai.getFilhos().add(filho);
            }
        }
    }

    private void processarPaisSecundarios(
            DMontadorEstruturaPaiModulacao montadorModulacao,
            DPai paiPrincipal,
            Map<String, DPai> paisCriados) {

        for (int i = 0; i < montadorModulacao.getCores().size(); i++) {
            final int corIndex = i;

            for (DItemModulacao paiSecundario : montadorModulacao.getPaisSecundarios()) {
                DMontadorEstruturaPai montadorSecundario = criarMontadorSecundario(
                        montadorModulacao,
                        paiSecundario,
                        corIndex
                );

                DPai paiFilho = obterOuCriarPaiSecundario(montadorSecundario, paisCriados);

                vincularFilhoAoPaiPrincipal(paiPrincipal, paiFilho, corIndex);
                adicionarAcessorios(montadorModulacao, paiFilho, corIndex);
            }
        }
    }

    private DMontadorEstruturaPai criarMontadorSecundario(
            DMontadorEstruturaPaiModulacao montadorModulacao,
            DItemModulacao paiSecundario,
            int corIndex) {

        return new DMontadorEstruturaPai(
                paiSecundario.getPai().getModelo(),
                paiSecundario.getPai().getCategoriaComponente(),
                new ArrayList<>(Collections.singletonList(montadorModulacao.getCores().get(corIndex))),
                new ArrayList<>(Collections.singletonList(paiSecundario.getMedidas())),
                montadorModulacao.getMateriais(),
                paiSecundario.getMaquinas(),
                montadorModulacao.getImplantacao(),
                DTipoFilhoEnum.MDP,
                paiSecundario.getPai().getBordasComprimento(),
                paiSecundario.getPai().getBordasLargura(),
                paiSecundario.getPai().getPlasticoAcima(),
                paiSecundario.getPai().getPlasticoAdicional(),
                paiSecundario.getPai().getLarguraPlastico(),
                paiSecundario.getPai().getNumeroCantoneiras(),
                paiSecundario.getPai().getTntUmaFace(),
                null,
                paiSecundario.getPai().getFaces(),
                null
        );
    }

    private DPai obterOuCriarPaiSecundario(DMontadorEstruturaPai montador, Map<String, DPai> paisCriados) {
        String descricao = estruturaFacade.getCategoriaComponenteService()
                .buscar(montador.getCategoriaComponente().getCodigo()).getDescricao()
                + " " + estruturaFacade.getModeloService()
                .buscar(montador.getModelo().getCodigo()).getDescricao();

        if (paisCriados.containsKey(descricao)) {
            DPai paiExistente = paisCriados.get(descricao);
            estruturaPaiProcessor.processarMedidasEFilhos(montador, paiExistente);
            return paiExistente;
        }

        DPai novoPai = estruturaPaiProcessor.montarEstrutura(montador);
        paisCriados.put(novoPai.getDescricao(), novoPai);
        return novoPai;
    }

    private void vincularFilhoAoPaiPrincipal(DPai paiPrincipal, DPai paiFilho, int corIndex) {
        paiFilho.getFilhos().get(corIndex).calcularValor();
        paiPrincipal.getFilhos().get(corIndex).getFilhos().add(paiFilho.getFilhos().get(corIndex));
        paiPrincipal.getFilhos().get(corIndex).calcularValor();
    }

    private void adicionarAcessorios(
            DMontadorEstruturaPaiModulacao montadorModulacao,
            DPai paiFilho,
            int corIndex) {

        for (DAcessorioQuantidade acessorioQuantidade : montadorModulacao.getAcessoriosQuantidades()) {
            DAcessorioUsado acessorioUsado = new DAcessorioUsado();
            acessorioUsado.setAcessorio(estruturaFacade.getAcessorioService()
                    .buscar(acessorioQuantidade.getAcessorio().getCodigo()));
            acessorioUsado.setFilho(paiFilho.getFilhos().get(corIndex));
            acessorioUsado.setQuantidade(acessorioQuantidade.getQuantidade());
            acessorioUsado.calcularValor();

            acessorioUsado = estruturaFacade.getAcessorioUsadoService().incluir(acessorioUsado);
            paiFilho.getFilhos().get(corIndex).getAcessoriosUsados().add(acessorioUsado);
        }

        estruturaFacade.getFilhoService().atualizar(paiFilho.getFilhos().get(corIndex));
    }
}
