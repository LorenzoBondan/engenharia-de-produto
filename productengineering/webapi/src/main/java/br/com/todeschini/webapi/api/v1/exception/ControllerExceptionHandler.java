package br.com.todeschini.webapi.api.v1.exception;

import br.com.todeschini.domain.exceptions.OllamaOfflineException;
import br.com.todeschini.domain.exceptions.OllamaTimeoutException;
import br.com.todeschini.domain.exceptions.*;
import br.com.todeschini.domain.exceptions.handlers.CustomError;
import br.com.todeschini.domain.exceptions.handlers.ValidationError;
import com.fasterxml.jackson.databind.JsonMappingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
@Slf4j
public class ControllerExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<CustomError> resourceNotFound(ResourceNotFoundException e, HttpServletRequest request) {
        return ErrorResponseBuilder.buildErrorResponse(e, HttpStatus.NOT_FOUND, e.getMessage(), request);
    }

    @ExceptionHandler(RegistroDuplicadoException.class)
    public ResponseEntity<CustomError> registroDuplicado(RegistroDuplicadoException e, HttpServletRequest request) {
        return ErrorResponseBuilder.buildErrorResponse(e, HttpStatus.CONFLICT, e.getMessage() + " " + e.getDetail(), request);
    }

    @ExceptionHandler(DatabaseException.class)
    public ResponseEntity<CustomError> database(DatabaseException e, HttpServletRequest request) {
        return ErrorResponseBuilder.buildErrorResponse(e, HttpStatus.CONFLICT, e.getMessage(), request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationError> methodArgumentNotValidation(MethodArgumentNotValidException e, HttpServletRequest request) {
        return ErrorResponseBuilder.buildValidationErrorResponse(e, HttpStatus.UNPROCESSABLE_ENTITY, "Dados inválidos", request);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<CustomError> unauthorized(UnauthorizedException e, HttpServletRequest request) {
        return ErrorResponseBuilder.buildErrorResponse(e, HttpStatus.UNAUTHORIZED, e.getMessage(), request);
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<CustomError> forbidden(ForbiddenException e, HttpServletRequest request) {
        return ErrorResponseBuilder.buildErrorResponse(e, HttpStatus.FORBIDDEN, e.getMessage(), request);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<CustomError> badRequest(BadRequestException e, HttpServletRequest request) {
        return ErrorResponseBuilder.buildErrorResponse(e, HttpStatus.BAD_REQUEST, e.getMessage(), request);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<CustomError> validation(ValidationException e, HttpServletRequest request) {
        return ErrorResponseBuilder.buildErrorResponse(e, HttpStatus.UNPROCESSABLE_ENTITY, e.getMessage(), request);
    }

    @ExceptionHandler(ConstraintViolationException.class) // anotações de validação das entidades
    public ResponseEntity<CustomError> constraintViolation(ConstraintViolationException e, HttpServletRequest request) {
        return ErrorResponseBuilder.buildConstraintViolationResponse(e, HttpStatus.UNPROCESSABLE_ENTITY, request);
    }

    @ExceptionHandler(JsonMappingException.class) // String no lugar de Integer no body da request
    public ResponseEntity<CustomError> handleJsonMappingException(JsonMappingException e, HttpServletRequest request) {
        String fieldName = extractJsonFieldName(e);
        String errorMessage = "Erro na leitura do corpo JSON";
        if (fieldName != null) {
            errorMessage += ", campo problemático: " + fieldName;
        }
        errorMessage += ". Mensagem: " + e.getMessage();
        return ErrorResponseBuilder.buildErrorResponse(e, HttpStatus.BAD_REQUEST, errorMessage, request);
    }

    @ExceptionHandler(UniqueConstraintViolationException.class)
    public ResponseEntity<CustomError> uniqueConstraintViolation(UniqueConstraintViolationException e, HttpServletRequest request) {
        return ErrorResponseBuilder.buildErrorResponse(e, HttpStatus.CONFLICT, e.getMessage(), request);
    }

    private String extractJsonFieldName(JsonMappingException e) {
        return e.getPath().stream()
                .map(JsonMappingException.Reference::getFieldName)
                .findFirst()
                .orElse(null);
    }

    @ExceptionHandler(OllamaOfflineException.class)
    public ResponseEntity<Map<String, String>> handleOllamaOffline(OllamaOfflineException ex) {
        log.error("Ollama service unavailable", ex);

        Map<String, String> error = new HashMap<>();
        error.put("error", "Service Unavailable");
        error.put("message", "AI assistant is temporarily unavailable. Please try again later.");

        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(error);
    }

    @ExceptionHandler(OllamaTimeoutException.class)
    public ResponseEntity<Map<String, String>> handleOllamaTimeout(OllamaTimeoutException ex) {
        log.error("Ollama request timeout", ex);

        Map<String, String> error = new HashMap<>();
        error.put("error", "Gateway Timeout");
        error.put("message", "AI assistant took too long to respond. Please try again.");

        return ResponseEntity
                .status(HttpStatus.GATEWAY_TIMEOUT)
                .body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        log.error("Invalid request parameters", ex);

        Map<String, String> error = new HashMap<>();
        error.put("error", "Bad Request");
        error.put("message", ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(error);
    }
}
