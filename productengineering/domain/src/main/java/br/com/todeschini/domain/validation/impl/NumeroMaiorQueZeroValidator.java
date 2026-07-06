package br.com.todeschini.domain.validation.impl;

import br.com.todeschini.domain.validation.ValidationResult;
import br.com.todeschini.domain.validation.Validator;

import java.math.BigDecimal;

public class NumeroMaiorQueZeroValidator implements Validator<Number> {

    @Override
    public ValidationResult validate(Number s) {
        ValidationResult validationResult = new ValidationResult(true);
        if(s != null && new BigDecimal(s.toString()).compareTo(BigDecimal.ZERO) <= 0){
            validationResult = new ValidationResult(false, "Valor precisa ser maior que 0");
        }
        return validationResult;
    }
}
