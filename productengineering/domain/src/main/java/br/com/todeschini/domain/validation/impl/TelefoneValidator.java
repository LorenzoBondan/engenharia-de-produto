package br.com.todeschini.domain.validation.impl;

import br.com.todeschini.domain.validation.ValidationResult;
import br.com.todeschini.domain.validation.Validator;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TelefoneValidator implements Validator<String> {

    @Override
    public ValidationResult validate(String telefone) {
        ValidationResult validationResult = new ValidationResult(true);

        if (telefone != null && !isValidTelefoneFormat(telefone)) {
            validationResult = new ValidationResult(false, "Formato inválido de telefone");
        }

        return validationResult;
    }

    private boolean isValidTelefoneFormat(String telefone) {
        // Formato "XXXXXXXXX" ou "XXXXXXXXXX" ou "XXXXX-XXXX" ou "XXXXX-XXXX"
        String telefoneRegex = "\\d{8}|\\d{9}|\\d{4}-\\d{4}|\\d{5}-\\d{4}";

        Pattern pattern = Pattern.compile(telefoneRegex);
        Matcher matcher = pattern.matcher(telefone);

        return matcher.matches();
    }
}
