package br.com.todeschini.domain.util;

public class FormatadorNumeros {

    public static Double formatarValor(double valor) {
        return Math.round(valor * 1e2) / 1e2;
    }

    public static Double formatarQuantidade(double quantidade) {
        return Math.round(quantidade * 1e6) / 1e6;
    }
}
