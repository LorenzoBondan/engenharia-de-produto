package br.com.todeschini.persistence.publico.materialusado;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.PagedBuilder;
import br.com.todeschini.domain.business.publico.filho.api.FilhoService;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.history.api.HistoryService;
import br.com.todeschini.domain.business.publico.material.api.MaterialService;
import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;
import br.com.todeschini.domain.business.publico.materialusado.spi.CrudMaterialUsado;
import br.com.todeschini.domain.exceptions.ResourceNotFoundException;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.persistence.entities.enums.SituacaoEnum;
import br.com.todeschini.persistence.entities.publico.MaterialUsado;
import br.com.todeschini.persistence.filters.SituacaoFilter;
import br.com.todeschini.persistence.util.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class CrudMaterialUsadoImpl implements CrudMaterialUsado {

    private final MaterialUsadoRepository repository;
    private final MaterialUsadoQueryRepository queryRepository;
    private final MaterialUsadoDomainToEntityAdapter adapter;
    private final EntityService entityService;
    private final PageRequestUtils pageRequestUtils;
    private final HistoryService historyService;
    private final SituacaoFilter<MaterialUsado> situacaoFilter;
    private final FilhoService filhoService;
    private final MaterialService materialService;
    private final AuditoriaService auditoriaService;

    public CrudMaterialUsadoImpl(MaterialUsadoRepository repository, MaterialUsadoQueryRepository queryRepository, MaterialUsadoDomainToEntityAdapter adapter, EntityService entityService,
                                 PageRequestUtils pageRequestUtils, HistoryService historyService, SituacaoFilter<MaterialUsado> situacaoFilter, FilhoService filhoService, MaterialService materialService, AuditoriaService auditoriaService) {
        this.repository = repository;
        this.queryRepository = queryRepository;
        this.adapter = adapter;
        this.entityService = entityService;
        this.pageRequestUtils = pageRequestUtils;
        this.historyService = historyService;
        this.situacaoFilter = situacaoFilter;
        this.filhoService = filhoService;
        this.materialService = materialService;
        this.auditoriaService = auditoriaService;
    }

    @Override
    public Paged<DMaterialUsado> buscarTodos(PageableRequest request) {
        SpecificationHelper<MaterialUsado> helper = new SpecificationHelper<>();
        Specification<MaterialUsado> specification = helper.buildSpecification(request.getColunas(), request.getOperacoes(), request.getValores());
        specification = situacaoFilter.addExcludeSituacaoLixeira(specification);

        return Optional.of(queryRepository.findAll(specification, pageRequestUtils.toPage(request)))
                .map(r -> new PagedBuilder<DMaterialUsado>()
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
    public Collection<DMaterialUsado> pesquisarPorFilhoEMaterial(Integer cdfilho, Integer cdmaterial) {
        return queryRepository.findByFilho_CdfilhoAndMaterial_Cdmaterial(cdfilho, cdmaterial).stream().map(adapter::toDomain).toList();
    }

    @Override
    public DMaterialUsado buscar(Integer id) {
        return adapter.toDomain(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Código não encontrado: " + id)));
    }

    @Override
    public List<DHistory<DMaterialUsado>> buscarHistorico(Integer id) {
        return historyService.getHistoryEntityByRecord(MaterialUsado.class, "tb_material_usado", id.toString(), AttributeMappings.MATERIALUSADO.getMappings()).stream()
                .map(history -> new DHistory<>(history.getId(), history.getDate(), history.getAuthor(), adapter.toDomain(history.getEntity()), history.getDiff()))
                .collect(Collectors.toList());
    }

    @Override
    public List<String> buscarAtributosEditaveisEmLote() {
        return entityService.obterAtributosEditaveis(DMaterialUsado.class);
    }

    @Override
    public DMaterialUsado inserir(DMaterialUsado obj) {
        obj.setFilho(filhoService.buscar(obj.getFilho().getCodigo()));
        obj.setMaterial(materialService.buscar(obj.getMaterial().getCodigo()));
        entityService.verifyDependenciesStatus(adapter.toEntity(obj));
        return adapter.toDomain(repository.save(adapter.toEntity(obj)));
    }

    @Override
    public DMaterialUsado atualizar(DMaterialUsado obj) {
        if(!repository.existsById(obj.getCodigo())){
            throw new ResourceNotFoundException("Código não encontrado: " + obj.getCodigo());
        }
        obj.setFilho(filhoService.buscar(obj.getFilho().getCodigo()));
        obj.setMaterial(materialService.buscar(obj.getMaterial().getCodigo()));
        MaterialUsado entity = adapter.toEntity(obj);
        entityService.verifyDependenciesStatus(entity);
        auditoriaService.setCreationProperties(entity);
        return adapter.toDomain(repository.save(entity));
    }

    @Override
    public List<DMaterialUsado> atualizarEmLote(List<DMaterialUsado> list) {
        return list;
    }

    @Override
    public DMaterialUsado substituirPorVersaoAntiga(Integer id, Integer versionId) {
        DHistory<MaterialUsado> antiga = historyService.getHistoryEntityByRecord(MaterialUsado.class, "tb_material_usado", id.toString(), AttributeMappings.MATERIALUSADO.getMappings())
                .stream()
                .filter(historyWithId -> historyWithId.getId().equals(versionId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Versão " + versionId + " não encontrada para o código " + id));
        return adapter.toDomain(repository.save(antiga.getEntity()));
    }

    @Override
    public void inativar(Integer id) {
        MaterialUsado entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Código não encontrado: " + id));
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
