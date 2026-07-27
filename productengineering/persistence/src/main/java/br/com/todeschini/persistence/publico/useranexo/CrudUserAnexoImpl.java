package br.com.todeschini.persistence.publico.useranexo;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.PagedBuilder;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.history.api.HistoryService;
import br.com.todeschini.domain.business.publico.useranexo.DUserAnexo;
import br.com.todeschini.domain.business.publico.useranexo.spi.CrudUserAnexo;
import br.com.todeschini.domain.exceptions.ResourceNotFoundException;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.persistence.entities.enums.SituacaoEnum;
import br.com.todeschini.persistence.entities.publico.UserAnexo;
import br.com.todeschini.persistence.filters.SituacaoFilter;
import br.com.todeschini.persistence.util.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class CrudUserAnexoImpl implements CrudUserAnexo {

    private final UserAnexoRepository repository;
    private final UserAnexoQueryRepository queryRepository;
    private final UserAnexoDomainToEntityAdapter adapter;
    private final EntityService entityService;
    private final PageRequestUtils pageRequestUtils;
    private final HistoryService historyService;
    private final SituacaoFilter<UserAnexo> situacaoFilter;
    private final AuditoriaService auditoriaService;

    public CrudUserAnexoImpl(UserAnexoRepository repository, UserAnexoQueryRepository queryRepository, UserAnexoDomainToEntityAdapter adapter, EntityService entityService,
                             PageRequestUtils pageRequestUtils, HistoryService historyService, SituacaoFilter<UserAnexo> situacaoFilter, AuditoriaService auditoriaService) {
        this.repository = repository;
        this.queryRepository = queryRepository;
        this.adapter = adapter;
        this.entityService = entityService;
        this.pageRequestUtils = pageRequestUtils;
        this.historyService = historyService;
        this.situacaoFilter = situacaoFilter;
        this.auditoriaService = auditoriaService;
    }

    @Override
    public Paged<DUserAnexo> buscarTodos(PageableRequest request) {
        SpecificationHelper<UserAnexo> helper = new SpecificationHelper<>();
        Specification<UserAnexo> specification = helper.buildSpecification(request.getColunas(), request.getOperacoes(), request.getValores());
        specification = situacaoFilter.addExcludeSituacaoLixeira(specification);

        return Optional.of(queryRepository.findAll(specification, pageRequestUtils.toPage(request)))
                .map(r -> new PagedBuilder<DUserAnexo>()
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
    public Collection<DUserAnexo> pesquisarPorUserEAnexo(Integer cduser, Integer cdanexo) {
        return queryRepository.findByUser_IdAndAnexo_Cdanexo(cduser, cdanexo).stream().map(adapter::toDomain).toList();
    }

    @Override
    public DUserAnexo buscar(Integer id) {
        return adapter.toDomain(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Código não encontrado: " + id)));
    }

    @Override
    public List<DHistory<DUserAnexo>> buscarHistorico(Integer id) {
        return historyService.getHistoryEntityByRecord(UserAnexo.class, "tb_user_anexo", id.toString(), AttributeMappings.USERANEXO.getMappings()).stream()
                .map(history -> new DHistory<>(history.getId(), history.getDate(), history.getAuthor(), adapter.toDomain(history.getEntity()), history.getDiff()))
                .collect(Collectors.toList());
    }

    @Override
    public List<String> buscarAtributosEditaveisEmLote() {
        return null;
    }

    @Override
    public DUserAnexo inserir(DUserAnexo obj) {
        entityService.verifyDependenciesStatus(adapter.toEntity(obj));
        return adapter.toDomain(repository.save(adapter.toEntity(obj)));
    }

    @Override
    public DUserAnexo atualizar(DUserAnexo obj) {
        if(!repository.existsById(obj.getCodigo())){
            throw new ResourceNotFoundException("Código não encontrado: " + obj.getCodigo());
        }
        UserAnexo entity = adapter.toEntity(obj);
        entityService.verifyDependenciesStatus(entity);
        auditoriaService.setCreationProperties(entity);
        return adapter.toDomain(repository.save(entity));
    }

    @Override
    public List<DUserAnexo> atualizarEmLote(List<DUserAnexo> list) {
        return null;
    }

    @Override
    public DUserAnexo substituirPorVersaoAntiga(Integer id, Integer versionId) {
        return null;
    }

    @Override
    public void inativar(Integer id) {
        UserAnexo entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Código não encontrado: " + id));
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
