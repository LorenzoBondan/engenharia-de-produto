package br.com.todeschini.domain.business.relatorio;

import br.com.todeschini.domain.business.relatorio.api.RelatorioFilhoService;
import br.com.todeschini.domain.business.relatorio.spi.RelatorioFilhoMethods;
import br.com.todeschini.domain.metadata.DomainService;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@DomainService
public class RelatorioFilhoServiceImpl implements RelatorioFilhoService {

    private final RelatorioFilhoMethods relatorioFilhoMethods;

    public RelatorioFilhoServiceImpl(RelatorioFilhoMethods relatorioFilhoMethods) {
        this.relatorioFilhoMethods = relatorioFilhoMethods;
    }

    @Override
    public ByteArrayOutputStream gerarRelatorioPdf(Integer id) throws IOException {
        return relatorioFilhoMethods.gerarRelatorioPdf(id);
    }
}
