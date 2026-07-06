package br.com.todeschini.domain.validation.impl;

import br.com.todeschini.domain.validation.ValidationResult;
import br.com.todeschini.domain.validation.Validator;

public class LongTamanhoMaximoValidator implements Validator<Long> {

    private final int maxLength;

    public LongTamanhoMaximoValidator(int maxLength) {
        this.maxLength = maxLength;
    }

    @Override
    public ValidationResult validate(Long s) {
        String msg = null;

        if (s != null) {
            int length = s.toString().length();
            msg = (length > maxLength)
                    ? String.format("Não pode ter mais que %d dígitos.", maxLength)
                    : null;
        }
        return new ValidationResult(msg == null, msg);
    }
}

