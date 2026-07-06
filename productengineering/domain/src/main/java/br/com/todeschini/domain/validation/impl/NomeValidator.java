package br.com.todeschini.domain.validation.impl;

import br.com.todeschini.domain.validation.ValidationResult;
import br.com.todeschini.domain.validation.Validator;

public class NomeValidator implements Validator<String> {

    @Override
    public ValidationResult validate(String s) {
        ValidationResult validationResult = new ValidationResult(true);
        if(s != null && !s.matches("^[a-zA-Z \\-.']*$")){
            validationResult = new ValidationResult(false, "Formato inválido");
        }
        return validationResult;
    }
}
