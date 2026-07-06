package br.com.todeschini.domain.validation.impl;

import br.com.todeschini.domain.validation.ValidationResult;
import br.com.todeschini.domain.validation.Validator;

import java.math.BigDecimal;

public class ArrayMaiorQueZeroValidator implements Validator<Number[]> {

    @Override
    public ValidationResult validate(Number[] s) {
        ValidationResult validationResult = new ValidationResult(true);

        if (s != null) {
            for (Number num : s) {
                if (num == null || BigDecimal.valueOf(num.doubleValue()).compareTo(BigDecimal.ZERO) <= 0) {
                    validationResult = new ValidationResult(false, "Valor precisa ser maior que 0");
                    break;
                }
            }
        }

        return validationResult;
    }
}
