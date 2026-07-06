package br.com.todeschini.domain.validation.impl;

import br.com.todeschini.domain.validation.ValidationResult;
import br.com.todeschini.domain.validation.Validator;

public class StringNumericaValidator implements Validator<String> {

    @Override
    public ValidationResult validate(String s) {
        ValidationResult validationResult = new ValidationResult(true);
        if (s != null && !s.matches("\\d+")) {
            validationResult = new ValidationResult(false, "Deve conter apenas dígitos numéricos.");
        }
        return validationResult;
    }
}
