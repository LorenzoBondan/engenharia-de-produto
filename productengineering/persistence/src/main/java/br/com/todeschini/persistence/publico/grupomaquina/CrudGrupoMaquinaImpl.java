package br.com.todeschini.persistence.publico.grupomaquina;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.PagedBuilder;
import br.com.todeschini.domain.business.publico.grupomaquina.DGrupoMaquina;
import br.com.todeschini.domain.business.publico.grupomaquina.spi.CrudGrupoMaquina;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.history.api.HistoryService;
import br.com.todeschini.domain.exceptions.ResourceNotFoundException;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.persistence.entities.enums.SituacaoEnum;
import br.com.todeschini.persistence.entities.publico.GrupoMaquina;
import br.com.todeschini.persistence.filters.SituacaoFilter;
import br.com.todeschini.persistence.util.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class CrudGrupoMaquinaImpl implements CrudGrupoMaquina {

    private final GrupoMaquinaRepository repository;
    private final GrupoMaquinaQueryRepository queryRepository;
    private final GrupoMaquinaDomainToEntityAdapter adapter;
    private final EntityService entityService;
    private final PageRequestUtils pageRequestUtils;
    private final HistoryService historyService;
    private final SituacaoFilter<GrupoMaquina> situacaoFilter;
    private final AuditoriaService auditoriaService;

    public CrudGrupoMaquinaImpl(GrupoMaquinaRepository repository, GrupoMaquinaQueryRepository queryRepository, GrupoMaquinaDomainToEntityAdapter adapter, EntityService entityService,
                                PageRequestUtils pageRequestUtils, HistoryService historyService, SituacaoFilter<GrupoMaquina> situacaoFilter, AuditoriaService auditoriaService) {
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
    public Paged<DGrupoMaquina> buscarTodos(PageableRequest request) {
        SpecificationHelper<GrupoMaquina> helper = new SpecificationHelper<>();
        Specification<GrupoMaquina> specification = helper.buildSpecification(request.getColunas(), request.getOperacoes(), request.getValores());
        specification = situacaoFilter.addExcludeSituacaoLixeira(specification);

        return Optional.of(queryRepository.findAll(specification, pageRequestUtils.toPage(request)))
                .map(r -> new PagedBuilder<DGrupoMaquina>()
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
    public Collection<DGrupoMaquina> pesquisarPorNome(String nome) {
        return queryRepository.findByNomeIgnoreCase(nome).stream().map(adapter::toDomain).toList();
    }

    @Override
    public DGrupoMaquina buscar(Integer id) {
        return adapter.toDomain(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Código não encontrado: " + id)));
    }

    @Override
    public List<DHistory<DGrupoMaquina>> buscarHistorico(Integer id) {
        return historyService.getHistoryEntityByRecord(GrupoMaquina.class, "tb_grupo_maquina", id.toString(), AttributeMappings.GRUPOMAQUINA.getMappings()).stream()
                .map(history -> new DHistory<>(history.getId(), history.getDate(), history.getAuthor(), adapter.toDomain(history.getEntity()), history.getDiff()))
                .collect(Collectors.toList());
    }

    @Override
    public List<String> buscarAtributosEditaveisEmLote() {
        return List.of();
    }

    @Override
    public DGrupoMaquina inserir(DGrupoMaquina obj) {
        entityService.verifyDependenciesStatus(adapter.toEntity(obj));
        return adapter.toDomain(repository.save(adapter.toEntity(obj)));
    }

    @Override
    public DGrupoMaquina atualizar(DGrupoMaquina obj) {
        if(!repository.existsById(obj.getCodigo())){
            throw new ResourceNotFoundException("Código não encontrado: " + obj.getCodigo());
        }
        GrupoMaquina entity = adapter.toEntity(obj);
        entityService.verifyDependenciesStatus(entity);
        auditoriaService.setCreationProperties(entity);
        return adapter.toDomain(repository.save(entity));
    }

    @Override
    public List<DGrupoMaquina> atualizarEmLote(List<DGrupoMaquina> obj) {
        return List.of();
    }

    @Override
    public DGrupoMaquina substituirPorVersaoAntiga(Integer id, Integer versionId) {
        DHistory<GrupoMaquina> antiga = historyService.getHistoryEntityByRecord(GrupoMaquina.class, "tb_grupo_maquina", id.toString(), AttributeMappings.GRUPOMAQUINA.getMappings())
                .stream()
                .filter(historyWithId -> historyWithId.getId().equals(versionId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Versão " + versionId + " não encontrada para o código " + id));
        return adapter.toDomain(repository.save(antiga.getEntity()));
    }

    @Override
    public void inativar(Integer id) {
        GrupoMaquina entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Código não encontrado: " + id));
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
