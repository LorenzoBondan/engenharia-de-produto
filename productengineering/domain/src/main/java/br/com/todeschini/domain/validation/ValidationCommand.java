package br.com.todeschini.domain.validation;

public class ValidationCommand<T> {

    private NamedValidator<T> namedValidator;
    private T value;

    public ValidationCommand(NamedValidator<T> namedValidator, T value) {
        this.namedValidator = namedValidator;
        this.value = value;
    }

    ValidationResult evaluate(){
        return namedValidator.validate(value);
    }
}
