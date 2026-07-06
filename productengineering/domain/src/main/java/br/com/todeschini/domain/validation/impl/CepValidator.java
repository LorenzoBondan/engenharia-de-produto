package br.com.todeschini.domain.validation.impl;

import br.com.todeschini.domain.validation.ValidationResult;
import br.com.todeschini.domain.validation.Validator;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CepValidator implements Validator<String> {

    @Override
    public ValidationResult validate(String cep) {
        ValidationResult validationResult = new ValidationResult(true);

        if (cep != null && !isValidCepFormat(cep)) {
            validationResult = new ValidationResult(false, "Formato inválido de CEP");
        }

        return validationResult;
    }

    private boolean isValidCepFormat(String cep) {
        // Formato "XXXXXXXX" ou "XXXXX-XXX"
        String cepRegex = "\\d{8}|\\d{5}-\\d{3}";

        Pattern pattern = Pattern.compile(cepRegex);
        Matcher matcher = pattern.matcher(cep);

        return matcher.matches();
    }
}
