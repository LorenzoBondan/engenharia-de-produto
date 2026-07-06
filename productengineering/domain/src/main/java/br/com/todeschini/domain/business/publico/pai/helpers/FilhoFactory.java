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

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class FilhoFactory {

    private final FilhoService filhoService;
    private final CorService corService;
    private final MaterialProcessadorFactory materialProcessadorFactory;

    public FilhoFactory(FilhoService filhoService, CorService corService, MaterialProcessadorFactory materialProcessadorFactory) {
        this.filhoService = filhoService;
        this.corService = corService;
        this.materialProcessadorFactory = materialProcessadorFactory;
    }

    public DFilho criarFilho(DPai pai, String descricao, DCor cor, DMedidas medida, LocalDate implantacao, DTipoFilhoEnum tipoFilho) {
        return DFilho.builder()
                .codigo(null)
                .descricao(descricao)
                .pai(pai)
                .cor(cor)
                .medidas(medida)
                .roteiro(null)
                .unidadeMedida("UN")
                .implantacao(implantacao)
                .valor(null)
                .tipo(tipoFilho)
                .materiaisUsados(new ArrayList<>())
                .filhos(new ArrayList<>())
                .acessoriosUsados(new ArrayList<>())
                .build();
    }

    public DFilho criarFundo(DFilho filho) {
        String descricao = "Fundo " + filho.getDescricao() + " " +
                filho.getMedidas().getAltura() + "X" +
                filho.getMedidas().getLargura() + "X" +
                filho.getMedidas().getEspessura();

        List<DFilho> fundosExistentes = filhoService.pesquisarPorDescricaoEMedidas(descricao, filho.getMedidas().getCodigo());

        if (!fundosExistentes.isEmpty()) {
            return fundosExistentes.get(0);
        }

        DFilho fundo = filhoService.incluir(criarFilho(
                filho.getPai(),
                descricao,
                corService.buscar(4),
                filho.getMedidas(),
                filho.getImplantacao(),
                DTipoFilhoEnum.FUNDO
        ));

        MaterialProcessador chapaMDFProcessador = materialProcessadorFactory.getProcessador(DTipoMaterialEnum.CHAPA_MDF.toString());
        chapaMDFProcessador.processarMaterial(fundo, null);
        fundo.calcularValor();
        filhoService.atualizar(fundo);

        return fundo;
    }
}
