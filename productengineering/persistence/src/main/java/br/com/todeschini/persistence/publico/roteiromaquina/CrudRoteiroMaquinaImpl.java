package br.com.todeschini.persistence.publico.roteiromaquina;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.PagedBuilder;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.history.api.HistoryService;
import br.com.todeschini.domain.business.publico.roteiromaquina.DRoteiroMaquina;
import br.com.todeschini.domain.business.publico.roteiromaquina.spi.CrudRoteiroMaquina;
import br.com.todeschini.domain.exceptions.ResourceNotFoundException;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.persistence.entities.enums.SituacaoEnum;
import br.com.todeschini.persistence.entities.publico.RoteiroMaquina;
import br.com.todeschini.persistence.filters.SituacaoFilter;
import br.com.todeschini.persistence.util.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class CrudRoteiroMaquinaImpl implements CrudRoteiroMaquina {

    private final RoteiroMaquinaRepository repository;
    private final RoteiroMaquinaQueryRepository queryRepository;
    private final RoteiroMaquinaDomainToEntityAdapter adapter;
    private final EntityService entityService;
    private final PageRequestUtils pageRequestUtils;
    private final HistoryService historyService;
    private final SituacaoFilter<RoteiroMaquina> situacaoFilter;
    private final AuditoriaService auditoriaService;

    public CrudRoteiroMaquinaImpl(RoteiroMaquinaRepository repository, RoteiroMaquinaQueryRepository queryRepository, RoteiroMaquinaDomainToEntityAdapter adapter, EntityService entityService,
                                  PageRequestUtils pageRequestUtils, HistoryService historyService, SituacaoFilter<RoteiroMaquina> situacaoFilter, AuditoriaService auditoriaService) {
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
    public Paged<DRoteiroMaquina> buscarTodos(PageableRequest request) {
        SpecificationHelper<RoteiroMaquina> helper = new SpecificationHelper<>();
        Specification<RoteiroMaquina> specification = helper.buildSpecification(request.getColunas(), request.getOperacoes(), request.getValores());
        specification = situacaoFilter.addExcludeSituacaoLixeira(specification);

        return Optional.of(queryRepository.findAll(specification, pageRequestUtils.toPage(request)))
                .map(r -> new PagedBuilder<DRoteiroMaquina>()
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
    public Collection<DRoteiroMaquina> pesquisarPorRoteiroEMaquina(Integer cdroteiro, Integer cdmaquina) {
        return queryRepository.findByRoteiro_CdroteiroAndMaquina_Cdmaquina(cdroteiro, cdmaquina).stream().map(adapter::toDomain).toList();
    }

    @Override
    public DRoteiroMaquina buscar(Integer id) {
        return adapter.toDomain(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Código não encontrado: " + id)));
    }

    @Override
    public List<DHistory<DRoteiroMaquina>> buscarHistorico(Integer id) {
        return historyService.getHistoryEntityByRecord(RoteiroMaquina.class, "tb_roteiro_maquina", id.toString(), AttributeMappings.ROTEIROMAQUINA.getMappings()).stream()
                .map(history -> new DHistory<>(history.getId(), history.getDate(), history.getAuthor(), adapter.toDomain(history.getEntity()), history.getDiff()))
                .collect(Collectors.toList());
    }

    @Override
    public List<String> buscarAtributosEditaveisEmLote() {
        return entityService.obterAtributosEditaveis(DRoteiroMaquina.class);
    }

    @Override
    public DRoteiroMaquina inserir(DRoteiroMaquina obj) {
        entityService.verifyDependenciesStatus(adapter.toEntity(obj));
        return adapter.toDomain(repository.save(adapter.toEntity(obj)));
    }

    @Override
    public DRoteiroMaquina atualizar(DRoteiroMaquina obj) {
        if(!repository.existsById(obj.getCodigo())){
            throw new ResourceNotFoundException("Código não encontrado: " + obj.getCodigo());
        }
        RoteiroMaquina entity = adapter.toEntity(obj);
        entityService.verifyDependenciesStatus(entity);
        auditoriaService.setCreationProperties(entity);
        return adapter.toDomain(repository.save(entity));
    }

    @Override
    public List<DRoteiroMaquina> atualizarEmLote(List<DRoteiroMaquina> list) {
        return list;
    }

    @Override
    public DRoteiroMaquina substituirPorVersaoAntiga(Integer id, Integer versionId) {
        DHistory<RoteiroMaquina> antiga = historyService.getHistoryEntityByRecord(RoteiroMaquina.class, "tb_roteiro_maquina", id.toString(), AttributeMappings.ROTEIROMAQUINA.getMappings())
                .stream()
                .filter(historyWithId -> historyWithId.getId().equals(versionId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Versão " + versionId + " não encontrada para o código " + id));
        return adapter.toDomain(repository.save(antiga.getEntity()));
    }

    @Override
    public void inativar(Integer id) {
        RoteiroMaquina entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Código não encontrado: " + id));
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
