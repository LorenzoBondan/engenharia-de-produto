package br.com.todeschini.persistence.util;

import br.com.todeschini.domain.business.publico.lixeira.api.LixeiraService;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.domain.metadata.BatchEditable;
import br.com.todeschini.persistence.entities.enums.SituacaoEnum;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.ResolvableType;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.*;
import java.lang.reflect.Field;
import java.util.*;

@Service
public class EntityService {

    @Autowired
    private DynamicRepositoryFactory dynamicRepositoryFactory;
    @Autowired
    @Lazy
    private LixeiraService lixeiraService;

    @Transactional
    @SneakyThrows
    public <T> void changeStatusToOther(T entity, SituacaoEnum situacaoEnum) {
        updateStatusOtherRecursively(entity, situacaoEnum, new HashSet<>());
        saveEntity(entity);
    }

    @SneakyThrows
    public <T> void updateStatusAtivoRecursively(T entity, SituacaoEnum newStatus, Set<Object> processedEntities, Boolean retrieveDependencies) {
        if (entity != null && !processedEntities.contains(entity)) {
            processedEntities.add(entity); // Adiciona o objeto atual ao conjunto de objetos processados

            Class<?> currentClass = entity.getClass();
            while (currentClass != null) {
                updateAuditFields(entity, newStatus, currentClass);
                currentClass = currentClass.getSuperclass();
            }

            for (Field field : entity.getClass().getDeclaredFields()) {
                field.setAccessible(true);
                if (isAssociationField(field)) {
                    Object fieldValue = field.get(entity);
                    if (fieldValue instanceof Collection<?> collection) {
                        if(retrieveDependencies){
                            collection.forEach(subEntity -> updateStatusAtivoRecursively(subEntity, newStatus, new HashSet<>(processedEntities), true)); // listas (dependentes)
                        }

                    } else {
                        updateStatus(fieldValue, newStatus, processedEntities); // objetos (dependências)
                    }
                } else if (isManyToManyAssociationField(field)) {
                    Object fieldValue2 = field.get(entity);
                    if (fieldValue2 instanceof Collection<?> collection) {
                        if(retrieveDependencies){
                            collection.forEach(subEntity -> updateStatusAtivoRecursively(subEntity, newStatus, new HashSet<>(processedEntities), true));
                        }

                    }
                }
            }
            lixeiraService.remover(entity);
            saveEntity(entity);
        }
    }

    @SneakyThrows
    private <T> void updateStatus(T entity, SituacaoEnum newStatus, Set<Object> processedEntities) {
        if (entity != null && !processedEntities.contains(entity)) {
            // Adiciona a entidade ao conjunto de processadas
            processedEntities.add(entity);

            Class<?> currentClass = entity.getClass();
            while (currentClass != null) {
                updateAuditFields(entity, newStatus, currentClass);
                currentClass = currentClass.getSuperclass();
            }

            // Processa os campos da entidade
            for (Field field : entity.getClass().getDeclaredFields()) {
                field.setAccessible(true);
                if (field.isAnnotationPresent(ManyToOne.class) || field.isAnnotationPresent(OneToOne.class)) {
                    Object fieldValue = field.get(entity);
                    // Chamada recursiva com controle de entidades processadas
                    updateStatus(fieldValue, newStatus, processedEntities);
                }
            }

            // Remove da lixeira, se aplicável
            if (newStatus.equals(SituacaoEnum.ATIVO)) {
                lixeiraService.remover(entity);
            }
        }
    }

    @SneakyThrows
    private <T> void updateStatusOtherRecursively(T entity, SituacaoEnum newStatus, Set<Object> processedEntities) {
        if (entity != null && !processedEntities.contains(entity)) {
            processedEntities.add(entity); // Adiciona o objeto atual ao conjunto de objetos processados

            if (newStatus.equals(SituacaoEnum.LIXEIRA)) {
                lixeiraService.incluir(entity);
            }

            Class<?> currentClass = entity.getClass();
            while (currentClass != null) {
                updateAuditFields(entity, newStatus, currentClass);
                currentClass = currentClass.getSuperclass();
            }

            for (Field field : entity.getClass().getDeclaredFields()) {
                field.setAccessible(true);
                if (isAssociationField(field)) {
                    Object fieldValue = field.get(entity);
                    if (fieldValue instanceof Collection<?> collection) {
                        collection.forEach(subEntity -> updateStatusOtherRecursively(subEntity, newStatus, new HashSet<>(processedEntities))); // listas (dependentes)
                    }
                } else if (isManyToManyAssociationField(field)) {
                    Object fieldValue = field.get(entity);
                    if (fieldValue instanceof Collection<?> collection) {
                        collection.forEach(subEntity -> updateStatusOtherRecursively(subEntity, newStatus, new HashSet<>(processedEntities)));
                    }
                }
            }
        }
    }

    private boolean isAssociationField(Field field) {
        return field.isAnnotationPresent(OneToMany.class) || field.isAnnotationPresent(ManyToOne.class) ||
                field.isAnnotationPresent(OneToOne.class);
    }

    private boolean isManyToManyAssociationField(Field field){
        return field.isAnnotationPresent(ManyToMany.class);
    }

    @SneakyThrows
    private <T> void updateAuditFields(T entity, SituacaoEnum newStatus, Class<?> currentClass) {
        Field statusField = getFieldByName(currentClass);
        if (statusField != null) {
            statusField.setAccessible(true);
            statusField.set(entity, newStatus);
        }
    }

    private <T> void saveEntity(T entity) {
        Class<?> entityType = entity.getClass();
        CrudRepository<T, Integer> repository = dynamicRepositoryFactory.createRepository(entityType);
        repository.save(entity);
    }

    private Field getFieldByName(Class<?> clazz) {
        for (Field field : clazz.getDeclaredFields()) {
            if (field.getName().equals("situacao")) {
                return field;
            }
        }
        return null;
    }

    //************** VALIDAR DEPENDÊNCIAS

    /*@SneakyThrows
    public <T> void verifyDependenciesStatus(T entity) {
        if (entity != null) {
            for (Field field : entity.getClass().getDeclaredFields()) {
                field.setAccessible(true);
                if (isManyToOneOrOneToOne(field)) {
                    Object fieldValue = field.get(entity);
                    if(fieldValue != null){
                        verifyDependencyStatus(fieldValue);
                    }
                }
            }
        }
    }*/
    @SneakyThrows
    public <T> void verifyDependenciesStatus(T entity) {
        if (entity != null) {
            Class<?> currentClass = entity.getClass();

            while (currentClass != Object.class) {
                for (Field field : currentClass.getDeclaredFields()) {
                    field.setAccessible(true);
                    if (isManyToOneOrOneToOne(field)) {
                        Object fieldValue = field.get(entity);
                        if (fieldValue != null) {
                            verifyDependencyStatus(fieldValue);
                        }
                    }
                }
                currentClass = currentClass.getSuperclass();
            }
        }
    }

    @SneakyThrows
    private <T> void verifyDependencyStatus(T fieldValue) {
        Class<?> currentClass = fieldValue.getClass();

        for (Field dependencyField : currentClass.getDeclaredFields()) {
            dependencyField.setAccessible(true);
            if (dependencyField.isAnnotationPresent(Id.class)) {
                Object id = dependencyField.get(fieldValue);
                ResolvableType resolvableType = ResolvableType.forClassWithGenerics(Repository.class, currentClass, Integer.class);
                Class<?> entityType = resolvableType.resolveGeneric(0);
                CrudRepository<T, Integer> repository = dynamicRepositoryFactory.createRepository(entityType);
                Object obj = repository.findById((Integer) id).orElseThrow(() -> new ValidationException("Dependência " + currentClass.getSimpleName() + " não encontrada"));

                validateSituacao(obj);
                break;
            }
        }
    }

    @SneakyThrows
    private <T> void validateSituacao(T obj) {
        Class<?> currentClass = obj.getClass().getSuperclass();

        for (Field field : currentClass.getDeclaredFields()) {
            if ("situacao".equals(field.getName())) {
                field.setAccessible(true);
                Object situacaoValue = field.get(obj);
                if (!isValidSituacao(situacaoValue)) {
                    throw new ValidationException("Dependência " + obj.getClass().getSimpleName() + " na lixeira ou excluída");
                }
                break;
            }
        }
    }

    private boolean isValidSituacao(Object situacaoValue) {
        return situacaoValue.equals(SituacaoEnum.ATIVO) || situacaoValue.equals(SituacaoEnum.INATIVO);
    }

    private boolean isManyToOneOrOneToOne(Field field) {
        return field.isAnnotationPresent(ManyToOne.class) || field.isAnnotationPresent(OneToOne.class);
    }

    /**
     * Obter uma lista de atributos de uma entidade que são anotados com a anotação de edição em lote
     */
    public List<String> obterAtributosEditaveis(Class<?> currentClass) {
        List<String> atributosEditaveis = new ArrayList<>();
        Field[] fields = currentClass.getDeclaredFields();

        for (Field field : fields) {
            if (field.isAnnotationPresent(BatchEditable.class)) {
                atributosEditaveis.add(field.getName());
            }
        }

        return atributosEditaveis;
    }
}
