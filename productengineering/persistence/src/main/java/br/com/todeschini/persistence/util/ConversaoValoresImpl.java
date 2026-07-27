package br.com.todeschini.persistence.util;

import br.com.todeschini.domain.ConversaoValores;
import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.DomainEntityMapping;
import br.com.todeschini.domain.metadata.Domain;
import br.com.todeschini.domain.metadata.EntityAdapter;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Period;
import java.util.Map;
import java.util.Optional;

/**
 * Classe utilizada para converter os valores que vêm no método de edição em lote para seus respectivos tipos
 */
@Component
public class ConversaoValoresImpl implements ConversaoValores {

    private final DomainEntityMapping domainEntityMapping;
    private final ApplicationContext applicationContext;

    @PersistenceContext
    private EntityManager entityManager;

    public ConversaoValoresImpl(DomainEntityMapping domainEntityMapping, ApplicationContext applicationContext) {
        this.domainEntityMapping = domainEntityMapping;
        this.applicationContext = applicationContext;
    }

    public Object convertValor(Class<?> fieldType, Object valor) {
        if (fieldType.equals(Integer.class)) {
            return Integer.valueOf(valor.toString());
        } else if (fieldType.equals(String.class)) {
            return valor.toString();
        } else if (fieldType.equals(LocalDate.class)) {
            return LocalDate.parse(valor.toString());
        } else if (fieldType.equals(LocalDateTime.class)) {
            return LocalDateTime.parse(valor.toString());
        } else if (fieldType.equals(BigDecimal.class)) {
            return new BigDecimal(valor.toString());
        } else if (fieldType.equals(Boolean.class)) {
            return Boolean.valueOf(valor.toString());
        } else if (fieldType.equals(Double.class)) {
            return Double.valueOf(valor.toString());
        } else if (fieldType.equals(Float.class)) {
            return Float.valueOf(valor.toString());
        } else if (fieldType.equals(Period.class)) {
            return Period.parse(valor.toString());
        } else if (fieldType.equals(LocalTime.class)) {
            return LocalTime.parse(valor.toString());
        } else if (fieldType.isEnum()) {
            @SuppressWarnings("unchecked")
            Class<? extends Enum> enumClass = (Class<? extends Enum>) fieldType;
            return convertToEnum(enumClass, valor.toString());
        } else if (isDomainClass(fieldType)) {
            Class<?> entityClass = domainEntityMapping.getEntityClass(fieldType);
            if (entityClass != null) {
                return entityManager.find(entityClass, Integer.valueOf(valor.toString()));
            } else {
                throw new IllegalArgumentException("Entidade não encontrada para a classe de domínio: " + fieldType.getName());
            }
        }
        return valor;
    }

    private boolean isDomainClass(Class<?> fieldType) {
        return fieldType.isAnnotationPresent(Domain.class);
    }

    /**
     * Busca o adaptador para a entidade fornecida de forma genérica
     */
    @Override
    public Convertable<?, ?> findAdapterForEntity(Class<?> entityClass) {
        // recupera todos os beans do tipo Convertable
        Map<String, Convertable> beans = applicationContext.getBeansOfType(Convertable.class);

        // filtra o bean correto e faz o cast para Convertable<?, ?>
        Optional<? extends Convertable<?, ?>> optionalAdapter = beans.values().stream()
                .filter(bean -> {
                    EntityAdapter annotation = bean.getClass().getAnnotation(EntityAdapter.class);
                    return annotation != null && annotation.entityClass().equals(entityClass);
                })
                .map(bean -> (Convertable<?, ?>) bean)  // cast para Convertable<?, ?>
                .findFirst();

        return optionalAdapter.orElse(null);
    }

    /**
     * Busca um campo na hierarquia da classe, procurando na superclasse se não for encontrado na classe atual.
     *
     * @param clazz       A classe onde buscar o campo inicialmente.
     * @param nomeCampo   O nome do campo a ser buscado.
     * @return O campo encontrado.
     */
    @Override
    public Field buscarCampoNaHierarquia(Class<?> clazz, String nomeCampo) throws NoSuchFieldException {
        while (clazz != null) {
            try {
                return clazz.getDeclaredField(nomeCampo);
            } catch (NoSuchFieldException e) {
                clazz = clazz.getSuperclass();
            }
        }
        throw new NoSuchFieldException("Campo " + nomeCampo + " não encontrado.");
    }

    private <E extends Enum<E>> E convertToEnum(Class<E> enumClass, String value) {
        try {
            return Enum.valueOf(enumClass, value);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Valor inválido para o enum " + enumClass.getName() + ": " + value);
        }
    }
}
