package br.com.todeschini.domain.util;

import br.com.todeschini.domain.exceptions.BadRequestException;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Value;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Classe utilizada para calcular os valores com base em expressões customizadas
 */
public class FormulaCalculadora {

    // função para calcular a fórmula com base na expressão armazenada e nas variáveis fornecidas
    public static Double calcularFormulaCustomizada(String expressao, List<Integer> medidas) {
        try (Context context = Context.create()) {
            // extrair variáveis da expressão
            List<String> variaveis = extrairVariaveisDaExpressao(expressao);

            // Substituir as variáveis 'M1', 'M2', etc. pelos valores da lista de medidas
            int medidaIndex = 0;
            for (String variavel : variaveis) {
                if (variavel.startsWith("M")) {
                    if (medidaIndex >= medidas.size()) {
                        throw new BadRequestException("A fórmula requer mais valores de medidas do que os fornecidos: " + medidas);
                    }
                    Integer valorMedida = medidas.get(medidaIndex++);
                    expressao = expressao.replace(variavel, valorMedida.toString());
                }
            }

            // Executar a expressão usando GraalVM (JavaScript como linguagem de avaliação)
            Value resultado = context.eval("js", expressao);

            return Double.parseDouble(resultado.toString());
        } catch (BadRequestException e) {
            throw new BadRequestException(e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Erro ao calcular a fórmula customizada", e);
        }
    }

    // Função para extrair todas as variáveis da expressão (M1, M2, ..., P, G, X, Y, Z)
    private static List<String> extrairVariaveisDaExpressao(String expressao) {
        // Regex para encontrar variáveis do tipo M1, M2, ..., P, G, X, Y, Z
        Pattern pattern = Pattern.compile("M\\d+");
        Matcher matcher = pattern.matcher(expressao);

        List<String> variaveis = new ArrayList<>();
        while (matcher.find()) {
            String variavel = matcher.group();
            if (!variaveis.contains(variavel)) {
                variaveis.add(variavel);  // Adiciona a variável se ainda não estiver na lista
            }
        }

        return variaveis;
    }
}
