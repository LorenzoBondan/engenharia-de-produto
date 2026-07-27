package br.com.todeschini.persistence.util;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Join;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;

/**
 * Método buscarTodos
 * Classe genérica que contém a lógica de montagem da query, de acordo com as colunas, operações e valores solicitados
 */
public class SpecificationHelper<T> {

    public Specification<T> buildSpecification(List<String> colunas, List<String> operacoes, List<String> valores) {
        Specification<T> specification = null;

        for (int i = 0; i < colunas.size(); i++) {
            String coluna = colunas.get(i);
            String operacao = operacoes.size() > i ? operacoes.get(i) : operacoes.get(0);
            String valor = valores.size() > i ? valores.get(i) : valores.get(0);

            if (coluna.contains(".")) {
                String[] parts = coluna.split("\\.");
                String relatedField = parts[parts.length - 1];

                Specification<T> spec = (root, query, builder) -> {
                    Join<?, ?> join = null;

                    // Realiza o join até o campo final
                    for (int j = 0; j < parts.length - 1; j++) {
                        join = Objects.requireNonNullElse(join, root).join(parts[j]);
                    }

                    // Adicionando suporte para diferentes operações
                    return switch (operacao) {
                        case ":" -> createComparison(builder, join, relatedField, valor, ComparisonType.EQUAL);
                        case "!=" -> createComparison(builder, join, relatedField, valor, ComparisonType.NOT_EQUAL);
                        case ">" -> createComparison(builder, join, relatedField, valor, ComparisonType.GREATER_THAN);
                        case "<" -> createComparison(builder, join, relatedField, valor, ComparisonType.LESS_THAN);
                        case "<=" -> createComparison(builder, join, relatedField, valor, ComparisonType.LESS_THAN_OR_EQUAL);
                        case ">=" -> createComparison(builder, join, relatedField, valor, ComparisonType.GREATER_THAN_OR_EQUAL);
                        case "=" -> builder.like(
                                builder.function("unaccent", String.class, builder.upper(Objects.requireNonNull(join).get(relatedField).as(String.class))),
                                builder.function("unaccent", String.class, builder.literal("%" + valor.toUpperCase() + "%"))
                        );
                        default -> throw new UnsupportedOperationException("Operação não suportada: " + operacao);
                    };

                };

                if (specification == null) {
                    specification = Specification.where(spec);
                } else {
                    specification = valores.size() > 1 ? specification.and(spec) : specification.or(spec);
                }
            } else {
                // Caso seja uma coluna da entidade principal, usamos a lógica existente
                Specification<T> spec = new SearchSpecificationImpl<>(new SearchCriteria(coluna, operacao, valor));

                if (specification == null) {
                    specification = Specification.where(spec);
                } else {
                    specification = valores.size() > 1 ? specification.and(spec) : specification.or(spec);
                }
            }
        }

        return specification;
    }

    private Predicate createComparison(
            CriteriaBuilder builder,
            Join<?, ?> join,
            String relatedField,
            String valor,
            ComparisonType comparisonType
    ) {
        Path<?> path = Objects.requireNonNull(join).get(relatedField);

        // Tratamento para LocalTime
        if (path.getJavaType().equals(LocalTime.class)) {
            LocalTime timeValue = LocalTime.parse(valor);
            return switch (comparisonType) {
                case EQUAL -> builder.equal(path.as(LocalTime.class), timeValue);
                case NOT_EQUAL -> builder.notEqual(path.as(LocalTime.class), timeValue);
                case GREATER_THAN -> builder.greaterThan(path.as(LocalTime.class), timeValue);
                case LESS_THAN -> builder.lessThan(path.as(LocalTime.class), timeValue);
                case GREATER_THAN_OR_EQUAL -> builder.greaterThanOrEqualTo(path.as(LocalTime.class), timeValue);
                case LESS_THAN_OR_EQUAL -> builder.lessThanOrEqualTo(path.as(LocalTime.class), timeValue);
            };
        }

        // Tratamento para LocalDateTime
        if (path.getJavaType().equals(LocalDateTime.class)) {
            LocalDateTime dateTimeValue = LocalDateTime.parse(valor);
            return switch (comparisonType) {
                case EQUAL -> builder.equal(path.as(LocalDateTime.class), dateTimeValue);
                case NOT_EQUAL -> builder.notEqual(path.as(LocalDateTime.class), dateTimeValue);
                case GREATER_THAN -> builder.greaterThan(path.as(LocalDateTime.class), dateTimeValue);
                case LESS_THAN -> builder.lessThan(path.as(LocalDateTime.class), dateTimeValue);
                case GREATER_THAN_OR_EQUAL -> builder.greaterThanOrEqualTo(path.as(LocalDateTime.class), dateTimeValue);
                case LESS_THAN_OR_EQUAL -> builder.lessThanOrEqualTo(path.as(LocalDateTime.class), dateTimeValue);
            };
        }

        // Comparação padrão para outros tipos
        return switch (comparisonType) {
            case EQUAL -> builder.equal(path.as(String.class), valor);
            case NOT_EQUAL -> builder.notEqual(path.as(String.class), valor);
            case GREATER_THAN -> builder.greaterThan(path.as(String.class), valor);
            case LESS_THAN -> builder.lessThan(path.as(String.class), valor);
            case GREATER_THAN_OR_EQUAL -> builder.greaterThanOrEqualTo(path.as(String.class), valor);
            case LESS_THAN_OR_EQUAL -> builder.lessThanOrEqualTo(path.as(String.class), valor);
        };
    }

    private enum ComparisonType {
        EQUAL,
        NOT_EQUAL,
        GREATER_THAN,
        LESS_THAN,
        GREATER_THAN_OR_EQUAL,
        LESS_THAN_OR_EQUAL;
    }
}