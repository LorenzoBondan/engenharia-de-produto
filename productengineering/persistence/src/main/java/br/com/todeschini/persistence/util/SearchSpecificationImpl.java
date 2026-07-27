package br.com.todeschini.persistence.util;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

/**
 * Método buscarTodos
 * Classe genérica que implementa a lógica de busca das operações
 */
public class SearchSpecificationImpl<T> implements SearchSpecification<T> {

    private final SearchCriteria criteria;

    public SearchSpecificationImpl(SearchCriteria criteria) {
        this.criteria = criteria;
    }

    /**
     * > maior ou igual a
     * < menor ou igual a
     * = contém
     * : busca exata
     * != diferente de
     */
    @Override
    @SuppressWarnings("unchecked")
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
        if (criteria.getOperation().equalsIgnoreCase(">")) {
            if (isTemporal(root, criteria.getKey())) {
                return builder.greaterThan(
                        root.get(criteria.getKey()),
                        (Comparable) parseTemporalValue(root, criteria.getKey(), criteria.getValue().toString())
                );
            } else {
                return builder.greaterThan(
                        root.get(criteria.getKey()),
                        criteria.getValue().toString()
                );
            }
        } else if (criteria.getOperation().equalsIgnoreCase("<")) {
            if (isTemporal(root, criteria.getKey())) {
                return builder.lessThan(
                        root.get(criteria.getKey()),
                        (Comparable) parseTemporalValue(root, criteria.getKey(), criteria.getValue().toString())
                );
            } else {
                return builder.lessThan(
                        root.get(criteria.getKey()),
                        criteria.getValue().toString()
                );
            }
        } else if (criteria.getOperation().equalsIgnoreCase("=<")) {
            if (isTemporal(root, criteria.getKey())) {
                return builder.lessThanOrEqualTo(
                        root.get(criteria.getKey()),
                        (Comparable) parseTemporalValue(root, criteria.getKey(), criteria.getValue().toString())
                );
            } else {
                return builder.lessThanOrEqualTo(
                        root.get(criteria.getKey()),
                        criteria.getValue().toString()
                );
            }
        } else if (criteria.getOperation().equalsIgnoreCase(">=")) {
            if (isTemporal(root, criteria.getKey())) {
                return builder.greaterThanOrEqualTo(
                        root.get(criteria.getKey()),
                        (Comparable) parseTemporalValue(root, criteria.getKey(), criteria.getValue().toString())
                );
            } else {
                return builder.greaterThanOrEqualTo(
                        root.get(criteria.getKey()),
                        criteria.getValue().toString()
                );
            }
        } else if (criteria.getOperation().equalsIgnoreCase("=")) {
            if (isTemporal(root, criteria.getKey())) {
                return builder.equal(
                        root.get(criteria.getKey()),
                        parseTemporalValue(root, criteria.getKey(), criteria.getValue().toString())
                );
            } else if (root.get(criteria.getKey()).getJavaType().isEnum()) {
                return builder.equal(root.get(criteria.getKey()), Enum.valueOf((Class<Enum>) root.get(criteria.getKey()).getJavaType(), criteria.getValue().toString()));
            } else {
                return builder.like(
                        builder.function("unaccent", String.class, builder.upper(root.get(criteria.getKey()).as(String.class))),
                        builder.function("unaccent", String.class, builder.literal("%" + criteria.getValue().toString().toUpperCase() + "%"))
                );
            }
        } else if (criteria.getOperation().equalsIgnoreCase(":")) {
            if (isTemporal(root, criteria.getKey())) {
                return builder.equal(
                        root.get(criteria.getKey()),
                        parseTemporalValue(root, criteria.getKey(), criteria.getValue().toString())
                );
            } else if (root.get(criteria.getKey()).getJavaType().isEnum()) {
                return builder.equal(root.get(criteria.getKey()), Enum.valueOf((Class<Enum>) root.get(criteria.getKey()).getJavaType(), criteria.getValue().toString()));
            } else {
                return builder.equal(root.get(criteria.getKey()), criteria.getValue().toString());
            }
        } else if (criteria.getOperation().equalsIgnoreCase("!=")) {
            if (root.get(criteria.getKey()).getJavaType().isEnum()) {
                return builder.notEqual(root.get(criteria.getKey()), Enum.valueOf((Class<Enum>) root.get(criteria.getKey()).getJavaType(), criteria.getValue().toString()));
            } else if (isTemporal(root, criteria.getKey())) {
                return builder.notEqual(
                        root.get(criteria.getKey()),
                        parseTemporalValue(root, criteria.getKey(), criteria.getValue().toString())
                );
            } else {
                return builder.notEqual(root.get(criteria.getKey()), criteria.getValue());
            }
        }
        return null;
    }

    private boolean isTemporal(Root<T> root, String key) {
        try {
            Class<?> type = root.get(key).getJavaType();
            return LocalDate.class.isAssignableFrom(type) ||
                    LocalDateTime.class.isAssignableFrom(type) ||
                    LocalTime.class.isAssignableFrom(type);
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    private Comparable<?> parseTemporalValue(Root<T> root, String key, String value) {
        Class<?> type = root.get(key).getJavaType();
        if (LocalDate.class.isAssignableFrom(type)) {
            return LocalDate.parse(value, DateTimeFormatter.ISO_DATE);
        } else if (LocalDateTime.class.isAssignableFrom(type)) {
            return LocalDateTime.parse(value, DateTimeFormatter.ISO_DATE_TIME);
        } else if (LocalTime.class.isAssignableFrom(type)) {
            return LocalTime.parse(value, DateTimeFormatter.ISO_TIME);
        }
        throw new IllegalArgumentException("Tipo temporal não suportado: " + type);
    }
}
