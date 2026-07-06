package br.com.todeschini.domain.business.relatorio.spi;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

public interface RelatorioFilhoMethods {

    ByteArrayOutputStream gerarRelatorioPdf(Integer id) throws IOException;
}
