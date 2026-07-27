package br.com.todeschini.persistence.relatorio;

import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.filho.api.FilhoService;
import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;
import br.com.todeschini.domain.business.publico.roteiro.DRoteiro;
import br.com.todeschini.domain.business.publico.roteiromaquina.DRoteiroMaquina;
import br.com.todeschini.domain.business.relatorio.spi.RelatorioFilhoMethods;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class RelatorioFilhoMethodsImpl implements RelatorioFilhoMethods {

    private final FilhoService filhoService;

    public RelatorioFilhoMethodsImpl(FilhoService filhoService) {
        this.filhoService = filhoService;
    }

    @Override
    public ByteArrayOutputStream gerarRelatorioPdf(Integer id) throws IOException {
        DFilho filho = filhoService.buscar(id);

        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            // Controlador de posições para evitar sobreposição de texto
            float yOffset = 750;

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                // Adicionar o logo
                yOffset = adicionarLogo(document, contentStream, yOffset);

                // Adicionar título e descrição
                yOffset = adicionarTituloRelatorio(filho, contentStream, yOffset);

                // Adicionar materiais usados
                if (!filho.getMateriaisUsados().isEmpty()) {
                    yOffset = adicionarMateriais(filho.getMateriaisUsados(), contentStream, yOffset);
                }

                // Adicionar filhos
                if (!filho.getFilhos().isEmpty()) {
                    yOffset = adicionarFilhos(filho.getFilhos(), contentStream, yOffset);
                }

                // Adicionar roteiro
                if (filho.getRoteiro() != null) {
                    yOffset = adicionarRoteiro(filho.getRoteiro(), contentStream, yOffset);
                }
            }

            document.save(outputStream);
            return outputStream;
        }
    }

    private float adicionarLogo(PDDocument document, PDPageContentStream contentStream, float yOffset) throws IOException {
        // Carregar e adicionar logo
        PDImageXObject logo = PDImageXObject.createFromFile("persistence/src/main/resources/todeschini-header.png", document);
        contentStream.drawImage(logo, 50, yOffset, 150, 50);
        return yOffset - 40;  // Ajustar o yOffset após adicionar o logo
    }

    private float adicionarTituloRelatorio(DFilho filho, PDPageContentStream contentStream, float yOffset) throws IOException {
        // Adicionar título e descrição
        contentStream.beginText();
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 16);
        contentStream.newLineAtOffset(50, yOffset - 20);  // Adicionando 20 unidades de espaço
        contentStream.showText(filho.getCodigo() + " - " + filho.getDescricao());
        contentStream.endText();

        contentStream.beginText();
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
        contentStream.newLineAtOffset(50, yOffset - 40);  // Mais 20 de espaço entre o título e a descrição
        contentStream.showText(filho.getCor().getDescricao() + " - " +
                filho.getMedidas().getAltura() + "X" + filho.getMedidas().getLargura() + "X" + filho.getMedidas().getEspessura());
        contentStream.endText();

        return yOffset - 60;  // Subtrai 60 unidades no yOffset após o título
    }

    private float adicionarMateriais(List<DMaterialUsado> materiais, PDPageContentStream contentStream, float yOffset) throws IOException {
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
        contentStream.beginText();
        contentStream.newLineAtOffset(50, yOffset);
        contentStream.showText("Materiais Usados:");
        contentStream.endText();

        yOffset -= 20;

        // Largura das colunas
        float[] colWidths = {50, 300, 75, 50};
        float tableTopY = yOffset;

        // Cabeçalho da tabela
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 10);
        String[] headers = {"Código", "Descrição", "Quantidade", "Valor"};
        drawTableRow(contentStream, tableTopY, 50, colWidths, headers);

        yOffset -= 15;

        // Conteúdo da tabela
        contentStream.setFont(PDType1Font.HELVETICA, 10);
        for (DMaterialUsado material : materiais) {
            String[] rowData = {
                    String.valueOf(material.getMaterial().getCodigo()),
                    material.getMaterial().getDescricao(),
                    String.valueOf(material.getQuantidadeLiquida()),
                    String.valueOf(material.getValor())
            };
            drawTableRow(contentStream, yOffset, 50, colWidths, rowData);
            yOffset -= 15;  // Espaçamento entre as linhas
        }

        return yOffset - 20;  // Espaçamento após a lista de materiais
    }

    private float adicionarFilhos(List<DFilho> filhos, PDPageContentStream contentStream, float yOffset) throws IOException {
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
        contentStream.beginText();
        contentStream.newLineAtOffset(50, yOffset);
        contentStream.showText("Filhos:");
        contentStream.endText();

        yOffset -= 20;

        // Largura das colunas
        float[] colWidths = {50, 300};
        float tableTopY = yOffset;

        // Cabeçalho da tabela
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 10);
        String[] headers = {"Código", "Descrição"};
        drawTableRow(contentStream, tableTopY, 50, colWidths, headers);

        yOffset -= 15;

        // Conteúdo da tabela
        contentStream.setFont(PDType1Font.HELVETICA, 10);
        for (DFilho filho : filhos) {
            String[] rowData = {
                    String.valueOf(filho.getCodigo()),
                    filho.getDescricao()
            };
            drawTableRow(contentStream, yOffset, 50, colWidths, rowData);
            yOffset -= 15;  // Espaçamento entre as linhas

            // Atualiza o yOffset após adicionar os materiais do filho
            if(!filho.getMateriaisUsados().isEmpty()) {
                yOffset -= 15;
                yOffset = adicionarMateriais(filho.getMateriaisUsados(), contentStream, yOffset);
            }
        }

        return yOffset - 20;  // Espaçamento após a lista de filhos
    }

    private float adicionarRoteiro(DRoteiro roteiro, PDPageContentStream contentStream, float yOffset) throws IOException {
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
        contentStream.beginText();
        contentStream.newLineAtOffset(50, yOffset);
        contentStream.showText("Roteiro:");
        contentStream.endText();

        yOffset -= 20;

        // Cabeçalho da tabela
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 10);
        contentStream.beginText();
        contentStream.newLineAtOffset(50, yOffset);
        contentStream.showText("Implantação");
        contentStream.newLineAtOffset(200, 0);
        contentStream.showText("Data Limite");
        contentStream.endText();

        yOffset -= 15;

        // Conteúdo da tabela
        contentStream.setFont(PDType1Font.HELVETICA, 10);
        contentStream.beginText();
        contentStream.newLineAtOffset(50, yOffset);
        contentStream.showText(formatDate(roteiro.getImplantacao()));
        contentStream.newLineAtOffset(200, 0);
        contentStream.showText(formatDate(roteiro.getDataFinal()));
        contentStream.endText();

        yOffset -= 15;

        // Largura das colunas
        float[] colWidths = {150, 50, 50};
        float tableTopY = yOffset;

        // Cabeçalho da tabela
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 10);
        String[] headers = {"Máquina", "Tempo", "UN"};
        drawTableRow(contentStream, tableTopY, 50, colWidths, headers);

        yOffset -= 15;

        // Conteúdo da tabela
        contentStream.setFont(PDType1Font.HELVETICA, 10);
        for (DRoteiroMaquina roteiroMaquina : roteiro.getRoteiroMaquinas()) {
            String[] rowData = {
                    String.valueOf(roteiroMaquina.getMaquina().getDescricao()),
                    String.valueOf(roteiroMaquina.getTempoMaquina()),
                    String.valueOf(roteiroMaquina.getUnidadeMedida())
            };
            drawTableRow(contentStream, yOffset, 50, colWidths, rowData);
            yOffset -= 15;  // Espaçamento entre as linhas
        }

        return yOffset - 20;  // Espaço após o roteiro
    }

    private void drawTableRow(PDPageContentStream contentStream, float y, float xStart, float[] colWidths, String[] values) throws IOException {
        float height = 15;
        float cursorX = xStart;

        // Desenha as células
        for (int i = 0; i < values.length; i++) {
            contentStream.beginText();
            contentStream.newLineAtOffset(cursorX + 5, y - 10);  // Ajuste para centralizar o texto na célula
            contentStream.showText(values[i]);
            contentStream.endText();

            // Desenha o contorno da célula
            contentStream.addRect(cursorX, y - height, colWidths[i], height);
            contentStream.stroke();  // Desenha a borda

            cursorX += colWidths[i];  // Move o cursor para a próxima célula
        }
    }


    private String formatDate(LocalDate date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return date.format(formatter);
    }
}
