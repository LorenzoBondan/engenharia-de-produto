package br.com.todeschini.domain.validation.impl;

import br.com.todeschini.domain.validation.ValidationResult;
import br.com.todeschini.domain.validation.Validator;

public class TamanhoMinimoValidator implements Validator<String> {

    private final int minLength;

    public TamanhoMinimoValidator(int minLength) {
        this.minLength = minLength;
    }

    @Override
    public ValidationResult validate(String s) {
        String msg = null;

        if (s != null) {
            int length = s.length();
            msg = (length < minLength)
                    ? String.format("Deve ter pelo menos %d caracteres.", minLength)
                    : null;
        }
        return new ValidationResult(msg == null, msg);
    }

}

