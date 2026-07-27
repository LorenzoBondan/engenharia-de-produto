package br.com.todeschini.persistence.util;

import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.lang.reflect.Field;

/**
 * Classe auxiliar para recuperar nomes e valores de atributos mapeados com anotações
 * Utilizado no AuditoriaRepository e AuditoriaService
 */
public class JpaMetadataUtils {

    /// busca o nome da tabela, anotada com @Table
    public static String getTableName(Class<?> entityClass) {
        Class<?> currentClass = entityClass;
        while (currentClass != null) {
            if (currentClass.isAnnotationPresent(Table.class)) {
                Table tableAnnotation = currentClass.getAnnotation(Table.class);
                return tableAnnotation.name();
            }
            currentClass = currentClass.getSuperclass(); // verifica a superclasse
        }
        throw new IllegalArgumentException("Nenhuma classe na hierarquia de " + entityClass.getName() + " possui a anotação @Table.");
    }

    /// busca o nome da coluna anotada com @Id
    public static String getIdColumnName(Class<?> entityClass) {
        Class<?> currentClass = entityClass;
        while (currentClass != null) {
            for (Field field : currentClass.getDeclaredFields()) {
                if (field.isAnnotationPresent(Id.class)) {
                    return StringUtils.toSnakeCase(field.getName());
                }
            }
            currentClass = currentClass.getSuperclass(); // verifica a superclasse
        }
        throw new IllegalArgumentException("Nenhuma classe na hierarquia de " + entityClass.getName() + " possui um campo anotado com @Id.");
    }

    /// busca o campo anotado com @Id e retorna o valor do ID
    public static <T> Integer extractId(T entity) {
        Class<?> currentClass = entity.getClass();
        while (currentClass != null) {
            for (Field field : currentClass.getDeclaredFields()) {
                if (field.isAnnotationPresent(Id.class)) {
                    field.setAccessible(true);
                    try {
                        Integer id = (Integer) field.get(entity);
                        if (id == null) {
                            throw new RuntimeException("O campo ID não pode ser nulo.");
                        }
                        return id;
                    } catch (IllegalAccessException e) {
                        throw new RuntimeException("Erro ao acessar o campo ID da entidade " + currentClass.getName(), e);
                    }
                }
            }
            currentClass = currentClass.getSuperclass(); // verifica na superclasse
        }
        throw new IllegalArgumentException("Nenhuma classe na hierarquia de " + entity.getClass().getName() + " possui um campo anotado com @Id.");
    }
}