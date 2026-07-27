package br.com.todeschini.persistence.publico.lixeira;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.PagedBuilder;
import br.com.todeschini.domain.business.publico.lixeira.DLixeira;
import br.com.todeschini.domain.business.publico.lixeira.spi.LixeiraOperations;
import br.com.todeschini.domain.exceptions.ResourceNotFoundException;
import br.com.todeschini.persistence.entities.enums.SituacaoEnum;
import br.com.todeschini.persistence.entities.publico.Lixeira;
import br.com.todeschini.persistence.util.*;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.Id;
import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;

/**
 * Implementação dos serviços de operações de Lixeira.
 * Esta classe gerencia as operações relacionadas a Lixeira
 */
@Component
public class LixeiraOperationsImpl implements LixeiraOperations {

    private final LixeiraRepository repository;
    private final LixeiraQueryRepository queryRepository;
    private final LixeiraDomainToEntityAdapter adapter;
    private final PageRequestUtils pageRequestUtils;
    @Lazy
    private final EntityService entityService;
    private final DynamicRepositoryFactory dynamicRepositoryFactory;
    private final CustomUserUtil customUserUtil;

    public LixeiraOperationsImpl(LixeiraRepository repository, LixeiraQueryRepository queryRepository, LixeiraDomainToEntityAdapter adapter, PageRequestUtils pageRequestUtils, EntityService entityService, DynamicRepositoryFactory dynamicRepositoryFactory, CustomUserUtil customUserUtil) {
        this.repository = repository;
        this.queryRepository = queryRepository;
        this.adapter = adapter;
        this.pageRequestUtils = pageRequestUtils;
        this.entityService = entityService;
        this.dynamicRepositoryFactory = dynamicRepositoryFactory;
        this.customUserUtil = customUserUtil;
    }

    @Override
    @Transactional(readOnly = true)
    public Paged<DLixeira> buscar(PageableRequest request) {
        SpecificationHelper<Lixeira> helper = new SpecificationHelper<>();
        Specification<Lixeira> specification = helper.buildSpecification(request.getColunas(), request.getOperacoes(), request.getValores());

        return Optional.of(queryRepository.findAll(specification, pageRequestUtils.toPage(request)))
                .map(r -> new PagedBuilder<DLixeira>()
                        .withContent(r.getContent().stream().map(adapter::toDomain).toList())
                        .withSortedBy(String.join(";", request.getSort()))
                        .withFirst(r.isFirst())
                        .withLast(r.isLast())
                        .withPage(r.getNumber())
                        .withSize(r.getSize())
                        .withTotalPages(r.getTotalPages())
                        .withNumberOfElements(Math.toIntExact(r.getTotalElements()))
                        .build())
                .orElse(null);
    }

    @Override
    @Transactional
    public <T> void incluir(T entity) throws IllegalAccessException {
        Map<String, Object> entidadeIdMap = new HashMap<>();

        for (Class<?> classeAtual = entity.getClass(); classeAtual != null; classeAtual = classeAtual.getSuperclass()) {
            for (Field field : classeAtual.getDeclaredFields()) {
                field.setAccessible(true);
                if (field.isAnnotationPresent(Id.class)) {
                    Object id = field.get(entity);
                    entidadeIdMap.put(field.getName(), id);
                    break; // Sai do loop se encontrar o campo
                }
            }
        }

        String loggedUser = customUserUtil.getLoggedUsername();
        if(loggedUser.length() > 50){
            loggedUser = loggedUser.substring(0, 50);
        }

        Lixeira lixeira = repository.findByEntidadeid(entidadeIdMap);
        if(lixeira != null){
            lixeira.setData(LocalDateTime.now());
            lixeira.setUsuario(loggedUser);
            lixeira.setSituacao(SituacaoEnum.LIXEIRA);
            repository.save(lixeira);
        } else{
            repository.save(Lixeira.builder()
                    .data(LocalDateTime.now())
                    .nometabela(entity.getClass().getSimpleName())
                    .tabela(String.valueOf(entity.getClass()))
                    .usuario(loggedUser)
                    .situacao(SituacaoEnum.LIXEIRA)
                    .entidadeid(entidadeIdMap)
                    .build()
            );
        }
    }

    @Override
    @Transactional
    public <T> void recuperar(Integer id, Boolean recuperarDependencias) {
        if(repository.existsById(id)){
            Lixeira lixeira = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Código não encontrado: " + id));
            String entityClassName = lixeira.getTabela().replace("class ", "");
            Map<String, Object> entityIds = lixeira.getEntidadeid();

            Class<T> entityType;
            try {
                entityType = (Class<T>) Class.forName(entityClassName);
            } catch (ClassNotFoundException e) {
                throw new RuntimeException("Tipo de entidade não encontrado: " + entityClassName, e);
            }
            CrudRepository<T, Integer> repository = dynamicRepositoryFactory.createRepository(entityType);

            for (Map.Entry<String, Object> entry : entityIds.entrySet()) {
                Object fieldValue = entry.getValue();
                Integer entityId = fieldValue instanceof Integer ? ((Integer) fieldValue).intValue() : (Integer) fieldValue;
                T entity = repository.findById(entityId).orElseThrow(() -> new ResourceNotFoundException("Entidade não encontrada com ID: " + entityId));

                entityService.updateStatusAtivoRecursively(entity, SituacaoEnum.ATIVO, new HashSet<>(), recuperarDependencias);
            }
        }
    }

    @Override
    @Transactional
    public <T> void recuperarPorEntidadeId(Map<String, Object> entidadeid, Boolean recuperarDependencias) {
        DLixeira lixeira = Optional.ofNullable(repository.findByEntidadeid(entidadeid))
                .map(adapter::toDomain)
                .orElseThrow(() -> new ResourceNotFoundException("Entidade com o código: " + entidadeid + " especificado não encontrada na lixeira"));

        recuperar(lixeira.getId(), recuperarDependencias);
    }

    @Override
    @Transactional
    public <T> void remover(T entity) throws IllegalAccessException {
        Map<String, Object> entidadeIdMap = new HashMap<>();

        // Percorre a hierarquia de classes (incluindo superclasses) para encontrar o @Id
        for (Class<?> classeAtual = entity.getClass(); classeAtual != null; classeAtual = classeAtual.getSuperclass()) {
            for (Field field : classeAtual.getDeclaredFields()) {
                field.setAccessible(true);
                if (field.isAnnotationPresent(Id.class)) {
                    Object id = field.get(entity);
                    entidadeIdMap.put(field.getName(), id);
                    break;
                }
            }
        }

        Lixeira lixeira = repository.findByEntidadeid(entidadeIdMap);
        if(lixeira != null){
            repository.delete(lixeira);
        }
    }
}
