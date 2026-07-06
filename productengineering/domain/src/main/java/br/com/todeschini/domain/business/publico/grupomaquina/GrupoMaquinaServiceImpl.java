package br.com.todeschini.domain.business.publico.grupomaquina;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.grupomaquina.api.GrupoMaquinaService;
import br.com.todeschini.domain.business.publico.grupomaquina.spi.CrudGrupoMaquina;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.exceptions.RegistroDuplicadoException;
import br.com.todeschini.domain.metadata.DomainService;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@DomainService
public class GrupoMaquinaServiceImpl implements GrupoMaquinaService {

    private final CrudGrupoMaquina crudGrupoMaquina;

    public GrupoMaquinaServiceImpl(CrudGrupoMaquina crudGrupoMaquina) {
        this.crudGrupoMaquina = crudGrupoMaquina;
    }

    @Override
    public Paged<DGrupoMaquina> buscar(PageableRequest request) {
        return crudGrupoMaquina.buscarTodos(request);
    }

    @Override
    public DGrupoMaquina buscar(Integer id) {
        return crudGrupoMaquina.buscar(id);
    }

    @Override
    public List<DHistory<DGrupoMaquina>> buscarHistorico(Integer id) {
        return crudGrupoMaquina.buscarHistorico(id);
    }

    @Override
    public DGrupoMaquina incluir(DGrupoMaquina domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudGrupoMaquina.inserir(domain);
    }

    @Override
    public DGrupoMaquina atualizar(DGrupoMaquina domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudGrupoMaquina.atualizar(domain);
    }

    @Override
    public DGrupoMaquina substituirPorVersaoAntiga(Integer id, Integer versionId) {
        return crudGrupoMaquina.substituirPorVersaoAntiga(id, versionId);
    }

    @Override
    public void inativar(Integer id) {
        crudGrupoMaquina.inativar(id);
    }

    @Override
    public void excluir(Integer id) {
        crudGrupoMaquina.remover(id);
    }

    private void validarRegistroDuplicado(DGrupoMaquina domain){
        Collection<DGrupoMaquina> registrosExistentes = crudGrupoMaquina.pesquisarPorNome(domain.getDescricao());

        for (DGrupoMaquina existente : registrosExistentes) {
            if (!existente.getCodigo().equals(Optional.ofNullable(domain.getCodigo()).orElse(-1))) {
                if (DSituacaoEnum.ATIVO.equals(existente.getSituacao())) {
                    throw new RegistroDuplicadoException("Verifique o campo nome.");
                } else if (DSituacaoEnum.INATIVO.equals(existente.getSituacao())){
                    throw new RegistroDuplicadoException("Já existe um registro inativo com esse nome. Reative-o antes de criar um novo.");
                } else if (DSituacaoEnum.LIXEIRA.equals(existente.getSituacao())){
                    throw new RegistroDuplicadoException("Já existe um registro com esse nome na lixeira. Reative-o antes de criar um novo.");
                }
            }
        }
    }
}
