package br.com.todeschini.domain.validation;

public class NamedValidator<T>{

    private final String identification;
    private final Validator<T> validator;


    public NamedValidator(String identification, Validator<T> validator) {
        this.identification = identification;
        this.validator = validator;
    }

    private String processMsg(ValidationResult vtemp){
        return String.join(". ", identification, vtemp.msg());
    }

    public ValidationResult validate(T t){
        ValidationResult vtemp = null;
        try {
            vtemp = validator.validate(t);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        if(vtemp.invalid()){
            vtemp = new ValidationResult(vtemp.valid(), processMsg(vtemp));
        }
        return vtemp;
    }

    public Validator<T> and(NamedValidator<? super T> other) {
        return obj -> {
            ValidationResult result = this.validate(obj);
            return !result.valid() ? result : other.validate(obj);
        };
    }

    public Validator<T> or(NamedValidator<? super T> other) {
        return obj -> {
            ValidationResult result = this.validate(obj);
            return result.valid() ? result : other.validate(obj);
        };
    }

    public Validator<T> negate() {
        return obj -> {
            ValidationResult result = this.validate(obj);
            return new ValidationResult(!result.valid(), result.msg());
        };
    }

}
