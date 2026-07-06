package br.com.todeschini.domain.validation;

@FunctionalInterface
public interface Validator<T>{
    ValidationResult validate(T t) throws Exception;

    default Validator<T> and(Validator<? super T> other) {
        return obj -> {
            ValidationResult result = this.validate(obj);
            return !result.valid() ? result : other.validate(obj);
        };
    }

    default Validator<T> or(Validator<? super T> other) {
        return obj -> {
            ValidationResult result = this.validate(obj);
            return result.valid() ? result : other.validate(obj);
        };
    }

    default Validator<T> negate() {
        return obj -> {
            ValidationResult result = this.validate(obj);
            return new ValidationResult(!result.valid(), result.msg());
        };
    }
}
