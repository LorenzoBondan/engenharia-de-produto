package br.com.todeschini.persistence.publico.user;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.PagedBuilder;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.history.api.HistoryService;
import br.com.todeschini.domain.business.publico.user.DUser;
import br.com.todeschini.domain.business.publico.user.spi.CrudUser;
import br.com.todeschini.domain.exceptions.ResourceNotFoundException;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.persistence.entities.enums.SituacaoEnum;
import br.com.todeschini.persistence.entities.publico.User;
import br.com.todeschini.persistence.filters.SituacaoFilter;
import br.com.todeschini.persistence.util.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class CrudUserImpl implements CrudUser {

    private final UserRepository repository;
    private final UserQueryRepository queryRepository;
    private final UserDomainToEntityAdapter adapter;
    private final EntityService entityService;
    private final PageRequestUtils pageRequestUtils;
    private final HistoryService historyService;
    private final SituacaoFilter<User> situacaoFilter;
    private final AuditoriaService auditoriaService;
    private final PasswordEncoder passwordEncoder;

    public CrudUserImpl(UserRepository repository, UserQueryRepository queryRepository, UserDomainToEntityAdapter adapter, EntityService entityService,
                        PageRequestUtils pageRequestUtils, HistoryService historyService, SituacaoFilter<User> situacaoFilter, AuditoriaService auditoriaService, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.queryRepository = queryRepository;
        this.adapter = adapter;
        this.entityService = entityService;
        this.pageRequestUtils = pageRequestUtils;
        this.historyService = historyService;
        this.situacaoFilter = situacaoFilter;
        this.auditoriaService = auditoriaService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Paged<DUser> buscarTodos(PageableRequest request) {
        SpecificationHelper<User> helper = new SpecificationHelper<>();
        Specification<User> specification = helper.buildSpecification(request.getColunas(), request.getOperacoes(), request.getValores());
        specification = situacaoFilter.addExcludeSituacaoLixeira(specification);

        return Optional.of(queryRepository.findAll(specification, pageRequestUtils.toPage(request)))
                .map(r -> new PagedBuilder<DUser>()
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
    public Collection<DUser> findByEmail(String email) {
        return repository.findByEmail(email).stream().map(adapter::toDomain).toList();
    }

    @Override
    public DUser buscar(Integer id) {
        return adapter.toDomain(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Código não encontrado: " + id)));
    }

    @Override
    public List<DHistory<DUser>> buscarHistorico(Integer id) {
        return historyService.getHistoryEntityByRecord(User.class, "tb_user", id.toString(), AttributeMappings.USER.getMappings()).stream()
                .map(history -> new DHistory<>(history.getId(), history.getDate(), history.getAuthor(), adapter.toDomain(history.getEntity()), history.getDiff()))
                .collect(Collectors.toList());
    }

    @Override
    public List<String> buscarAtributosEditaveisEmLote() {
        return List.of();
    }

    @Override
    public DUser inserir(DUser obj) {
        obj.setPassword(passwordEncoder.encode(obj.getPassword()));
        entityService.verifyDependenciesStatus(adapter.toEntity(obj));
        return adapter.toDomain(repository.save(adapter.toEntity(obj)));
    }

    @Override
    public DUser atualizar(DUser obj) {
        if(!repository.existsById(obj.getId())){
            throw new ResourceNotFoundException("Código não encontrado: " + obj.getId());
        }
        if (!obj.getPassword().startsWith("$2a$")) {  // BCrypt hashes start with $2a$
            obj.setPassword(passwordEncoder.encode(obj.getPassword()));
        }
        User entity = adapter.toEntity(obj);
        entityService.verifyDependenciesStatus(entity);
        auditoriaService.setCreationProperties(entity);
        return adapter.toDomain(repository.save(entity));
    }

    @Override
    public void updatePassword(String newPassword, String oldPassword, DUser user) {
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new ValidationException("Incorrect old password");
        }
        repository.updatePassword(newPassword, user.getId());
    }

    @Override
    public List<DUser> atualizarEmLote(List<DUser> obj) {
        return List.of();
    }

    @Override
    public DUser substituirPorVersaoAntiga(Integer id, Integer versionId) {
        DHistory<User> antiga = historyService.getHistoryEntityByRecord(User.class, "tb_user", id.toString(), AttributeMappings.USER.getMappings())
                .stream()
                .filter(historyWithId -> historyWithId.getId().equals(versionId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Versão " + versionId + " não encontrada para o código " + id));
        return adapter.toDomain(repository.save(antiga.getEntity()));
    }

    @Override
    public void inativar(Integer id) {
        User entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Código não encontrado: " + id));
        if (entity.getSituacao() == SituacaoEnum.LIXEIRA) {
            throw new ValidationException("Não é possível ativar/inativar um registro excluído.");
        }
        SituacaoEnum situacao = entity.getSituacao() == SituacaoEnum.ATIVO ? SituacaoEnum.INATIVO : SituacaoEnum.ATIVO;
        entity.setSituacao(situacao);
        repository.save(entity);
    }

    @Override
    public void remover(Integer id) {
        entityService.changeStatusToOther(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Código não encontrado: " + id)), SituacaoEnum.LIXEIRA);
    }
}
