package br.com.todeschini.domain.validation.impl;

import br.com.todeschini.domain.validation.ValidationResult;
import br.com.todeschini.domain.validation.Validator;

import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

public class CaracteresEspeciaisValidator implements Validator<String> {

    private static final Pattern INVALID_CHARACTERS_PATTERN = Pattern.compile("[(){}<>\\[\\]\\\\/|\"`~!#$%^&*+_§;]");

    @Override
    public ValidationResult validate(String s) {
        ValidationResult validationResult = new ValidationResult(true);
        if (s != null) {
            Set<Character> invalidCharacters = new HashSet<>();
            for (char c : s.toCharArray()) {
                if (INVALID_CHARACTERS_PATTERN.matcher(Character.toString(c)).find()) {
                    invalidCharacters.add(c);
                }
            }
            if (!invalidCharacters.isEmpty()) {
                validationResult = new ValidationResult(false, "O campo contém caracteres inválidos: " + invalidCharacters.toString());
            }
        }
        return validationResult;
    }
}