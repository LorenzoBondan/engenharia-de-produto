package br.com.todeschini.domain.validation.impl;

import br.com.todeschini.domain.validation.DataRange;
import br.com.todeschini.domain.validation.ValidationResult;
import br.com.todeschini.domain.validation.Validator;

import java.time.LocalDate;

public class DataInicialAntesDeDataFinalValidator implements Validator<DataRange> {

    @Override
    public ValidationResult validate(DataRange dataRange) {
        ValidationResult validationResult = new ValidationResult(true);

        if (dataRange != null) {
            LocalDate dataInicial = dataRange.getDataInicial();
            LocalDate dataFinal = dataRange.getDataFinal();

            if (dataInicial != null && dataFinal != null && dataInicial.isAfter(dataFinal)) {
                validationResult = new ValidationResult(false, "A data inicial deve ser antes da data final");
            }
        }

        return validationResult;
    }
}

