package br.com.todeschini.domain.validation.impl;

import br.com.todeschini.domain.validation.ValidationResult;
import br.com.todeschini.domain.validation.Validator;

import java.time.LocalDate;

public class DataFuturaValidator implements Validator<LocalDate> {

    @Override
    public ValidationResult validate(LocalDate date) {
        ValidationResult validationResult = new ValidationResult(true);

        if (date != null && !date.isAfter(LocalDate.now())) {
            validationResult = new ValidationResult(false, "A data deve ser maior do que a data atual");
        }

        return validationResult;
    }
}

