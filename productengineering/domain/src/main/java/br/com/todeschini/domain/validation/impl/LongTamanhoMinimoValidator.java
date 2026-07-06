package br.com.todeschini.domain.validation.impl;

import br.com.todeschini.domain.validation.ValidationResult;
import br.com.todeschini.domain.validation.Validator;

public class LongTamanhoMinimoValidator implements Validator<Long> {

    private final int minLength;

    public LongTamanhoMinimoValidator(int minLength) {
        this.minLength = minLength;
    }

    @Override
    public ValidationResult validate(Long s) {
        String msg = null;

        if (s != null) {
            int length = s.toString().length();
            msg = (length < minLength)
                    ? String.format("Deve ter pelo menos %d dígitos.", minLength)
                    : null;
        }
        return new ValidationResult(msg == null, msg);
    }

}

