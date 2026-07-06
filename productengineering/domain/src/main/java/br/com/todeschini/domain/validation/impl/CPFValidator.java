package br.com.todeschini.domain.validation.impl;

import br.com.todeschini.domain.validation.ValidationResult;
import br.com.todeschini.domain.validation.Validator;

public class CPFValidator implements Validator<String> {

    @Override
    public ValidationResult validate(String cpf) {
        ValidationResult validationResult = new ValidationResult(true);

        if (cpf != null && !isValidCPF(cpf)) {
            validationResult = new ValidationResult(false, "CPF inválido.");
        }

        return validationResult;
    }

    private boolean isValidCPF(String cpf) {
        // Remover caracteres não numéricos
        cpf = cpf.replaceAll("[^0-9]", "");

        // CPF deve ter 11 dígitos após a remoção de caracteres não numéricos
        if (cpf.length() != 11) {
            return false;
        }

        // Verificar se todos os dígitos são iguais (CPF inválido)
        if (cpf.matches("(\\d)\\1{10}")) {
            return false;
        }

        // Calcular e verificar os dígitos verificadores
        int[] multiplicadores1 = {10, 9, 8, 7, 6, 5, 4, 3, 2};
        int[] multiplicadores2 = {11, 10, 9, 8, 7, 6, 5, 4, 3, 2};
        int soma;
        int resto;
        int digitoVerificador1;
        int digitoVerificador2;

        // Verificar o primeiro dígito verificador
        soma = 0;
        for (int i = 0; i < 9; i++) {
            soma += (cpf.charAt(i) - '0') * multiplicadores1[i];
        }
        resto = soma % 11;
        if (resto < 2) {
            digitoVerificador1 = 0;
        } else {
            digitoVerificador1 = 11 - resto;
        }
        if ((cpf.charAt(9) - '0') != digitoVerificador1) {
            return false;
        }

        // Verificar o segundo dígito verificador
        soma = 0;
        for (int i = 0; i < 10; i++) {
            soma += (cpf.charAt(i) - '0') * multiplicadores2[i];
        }
        resto = soma % 11;
        if (resto < 2) {
            digitoVerificador2 = 0;
        } else {
            digitoVerificador2 = 11 - resto;
        }
        return (cpf.charAt(10) - '0') == digitoVerificador2;
    }
}
