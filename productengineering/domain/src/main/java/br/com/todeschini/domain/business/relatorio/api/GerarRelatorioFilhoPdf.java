package br.com.todeschini.domain.business.relatorio.api;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

public interface GerarRelatorioFilhoPdf {

    ByteArrayOutputStream gerarRelatorioPdf(Integer id) throws IOException;
}
