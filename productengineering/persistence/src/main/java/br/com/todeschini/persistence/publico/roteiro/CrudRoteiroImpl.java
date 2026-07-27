package br.com.todeschini.persistence.publico.roteiro;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.PagedBuilder;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.history.api.HistoryService;
import br.com.todeschini.domain.business.publico.roteiro.DRoteiro;
import br.com.todeschini.domain.business.publico.roteiro.spi.CrudRoteiro;
import br.com.todeschini.domain.exceptions.ResourceNotFoundException;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.persistence.entities.enums.SituacaoEnum;
import br.com.todeschini.persistence.entities.publico.Roteiro;
import br.com.todeschini.persistence.filters.SituacaoFilter;
import br.com.todeschini.persistence.util.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class CrudRoteiroImpl implements CrudRoteiro {

    private final RoteiroRepository repository;
    private final RoteiroQueryRepository queryRepository;
    private final RoteiroDomainToEntityAdapter adapter;
    private final EntityService entityService;
    private final PageRequestUtils pageRequestUtils;
    private final HistoryService historyService;
    private final SituacaoFilter<Roteiro> situacaoFilter;
    private final AuditoriaService auditoriaService;

    public CrudRoteiroImpl(RoteiroRepository repository, RoteiroQueryRepository queryRepository, RoteiroDomainToEntityAdapter adapter, EntityService entityService,
                           PageRequestUtils pageRequestUtils, HistoryService historyService, SituacaoFilter<Roteiro> situacaoFilter, AuditoriaService auditoriaService) {
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
    public Paged<DRoteiro> buscarTodos(PageableRequest request) {
        SpecificationHelper<Roteiro> helper = new SpecificationHelper<>();
        Specification<Roteiro> specification = helper.buildSpecification(request.getColunas(), request.getOperacoes(), request.getValores());
        specification = situacaoFilter.addExcludeSituacaoLixeira(specification);

        return Optional.of(queryRepository.findAll(specification, pageRequestUtils.toPage(request)))
                .map(r -> new PagedBuilder<DRoteiro>()
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
    public Collection<DRoteiro> pesquisarPorDescricao(String descricao) {
        return queryRepository.findByDescricaoIgnoreCase(descricao).stream().map(adapter::toDomain).toList();
    }

    @Override
    public Boolean existePorDescricao(String descricao) {
        return queryRepository.existsByDescricaoIgnoreCase(descricao);
    }

    @Override
    public DRoteiro buscar(Integer id) {
        return adapter.toDomain(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Código não encontrado: " + id)));
    }

    @Override
    public List<DHistory<DRoteiro>> buscarHistorico(Integer id) {
        return historyService.getHistoryEntityByRecord(Roteiro.class, "tb_roteiro", id.toString(), AttributeMappings.ROTEIRO.getMappings()).stream()
                .map(history -> new DHistory<>(history.getId(), history.getDate(), history.getAuthor(), adapter.toDomain(history.getEntity()), history.getDiff()))
                .collect(Collectors.toList());
    }

    @Override
    public List<String> buscarAtributosEditaveisEmLote() {
        return entityService.obterAtributosEditaveis(DRoteiro.class);
    }

    @Override
    public DRoteiro inserir(DRoteiro obj) {
        entityService.verifyDependenciesStatus(adapter.toEntity(obj));
        return adapter.toDomain(repository.save(adapter.toEntity(obj)));
    }

    @Override
    public DRoteiro atualizar(DRoteiro obj) {
        if(!repository.existsById(obj.getCodigo())){
            throw new ResourceNotFoundException("Código não encontrado: " + obj.getCodigo());
        }
        Roteiro entity = adapter.toEntity(obj);
        entityService.verifyDependenciesStatus(entity);
        auditoriaService.setCreationProperties(entity);
        return adapter.toDomain(repository.save(entity));
    }

    @Override
    public List<DRoteiro> atualizarEmLote(List<DRoteiro> list) {
        return list;
    }

    @Override
    public DRoteiro substituirPorVersaoAntiga(Integer id, Integer versionId) {
        DHistory<Roteiro> antiga = historyService.getHistoryEntityByRecord(Roteiro.class, "tb_roteiro", id.toString(), AttributeMappings.ROTEIRO.getMappings())
                .stream()
                .filter(historyWithId -> historyWithId.getId().equals(versionId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Versão " + versionId + " não encontrada para o código " + id));
        return adapter.toDomain(repository.save(antiga.getEntity()));
    }

    @Override
    public void inativar(Integer id) {
        Roteiro entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Código não encontrado: " + id));
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
