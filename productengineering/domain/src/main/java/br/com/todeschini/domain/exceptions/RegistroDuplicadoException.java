package br.com.todeschini.domain.exceptions;

import lombok.Getter;

import java.io.Serial;

@Getter
public class RegistroDuplicadoException extends RuntimeException{

    @Serial
    private static final long serialVersionUID = 1L;

    private static final String standardMessage = "Existem outros registros iguais a este.";
    private String detail;

    public RegistroDuplicadoException() {
        super(standardMessage);
    }

    public RegistroDuplicadoException(String detail){
        this();
        this.detail = detail;
    }
}
