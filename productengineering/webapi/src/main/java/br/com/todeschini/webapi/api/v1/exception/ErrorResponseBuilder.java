package br.com.todeschini.webapi.api.v1.exception;

import br.com.todeschini.domain.exceptions.handlers.CustomError;
import br.com.todeschini.domain.exceptions.handlers.ValidationError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
public class ErrorResponseBuilder {

    public static ResponseEntity<CustomError> buildErrorResponse(Exception e, HttpStatus status, String message, HttpServletRequest request) {
        CustomError err = new CustomError(LocalDateTime.now(), status.value(), message, request.getRequestURI());
        logError(e, request);
        return ResponseEntity.status(status).body(err);
    }

    public static ResponseEntity<ValidationError> buildValidationErrorResponse(MethodArgumentNotValidException e, HttpStatus status, String message, HttpServletRequest request) {
        ValidationError err = new ValidationError(LocalDateTime.now(), status.value(), message, request.getRequestURI());
        for (FieldError f : e.getBindingResult().getFieldErrors()) {
            err.addError(f.getField(), f.getDefaultMessage());
        }
        logError(e, request);
        return ResponseEntity.status(status).body(err);
    }

    public static ResponseEntity<CustomError> buildConstraintViolationResponse(ConstraintViolationException e, HttpStatus status, HttpServletRequest request) {
        List<String> constraintMessages = e.getConstraintViolations()
                .stream()
                .map(ConstraintViolation::getMessageTemplate)
                .collect(Collectors.toList());
        String concatenatedMessages = String.join(", ", constraintMessages);
        return buildErrorResponse(e, status, concatenatedMessages, request);
    }

    private static void logError(Exception e, HttpServletRequest request) {
        log.error("Erro ao processar @{} {}", request.getMethod(), request.getRequestURI(), e);
    }
}

