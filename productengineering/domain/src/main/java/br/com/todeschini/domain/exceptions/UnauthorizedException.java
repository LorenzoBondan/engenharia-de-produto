package br.com.todeschini.domain.exceptions;

import java.io.Serial;

public class UnauthorizedException extends RuntimeException{
    @Serial
    private static final long serialVersionUID = 1L;

    private String customMessage;

    public UnauthorizedException(String msg){
        super(msg);
        this.customMessage = msg;
    }

    public String getCustomMessage() {
        return customMessage;
    }
}
