package br.com.todeschini.domain.validation.impl;

import br.com.todeschini.domain.validation.ValidationResult;
import br.com.todeschini.domain.validation.Validator;

public class NaoBrancoValidator implements Validator<String> {

    @Override
    public ValidationResult validate(String s) {
        ValidationResult validationResult = new ValidationResult(true);
        if (s != null && s.trim().isEmpty()) {
            validationResult = new ValidationResult(false, "Não pode ser vazia ou conter apenas espaços.");
        }
        return validationResult;
    }
}
