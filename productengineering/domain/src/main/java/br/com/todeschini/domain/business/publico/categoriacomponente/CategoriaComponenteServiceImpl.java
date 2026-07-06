package br.com.todeschini.domain.business.publico.categoriacomponente;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.categoriacomponente.api.CategoriaComponenteService;
import br.com.todeschini.domain.business.publico.categoriacomponente.spi.CrudCategoriaComponente;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.exceptions.RegistroDuplicadoException;
import br.com.todeschini.domain.metadata.DomainService;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@DomainService
public class CategoriaComponenteServiceImpl implements CategoriaComponenteService {

    private final CrudCategoriaComponente crudCategoriaComponente;

    public CategoriaComponenteServiceImpl(CrudCategoriaComponente crudCategoriaComponente) {
        this.crudCategoriaComponente = crudCategoriaComponente;
    }

    @Override
    public Paged<DCategoriaComponente> buscar(PageableRequest request) {
        return crudCategoriaComponente.buscarTodos(request);
    }

    @Override
    public DCategoriaComponente buscar(Integer id) {
        return crudCategoriaComponente.buscar(id);
    }

    @Override
    public List<DHistory<DCategoriaComponente>> buscarHistorico(Integer id) {
        return crudCategoriaComponente.buscarHistorico(id);
    }

    @Override
    public DCategoriaComponente incluir(DCategoriaComponente domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudCategoriaComponente.inserir(domain);
    }

    @Override
    public DCategoriaComponente atualizar(DCategoriaComponente domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudCategoriaComponente.atualizar(domain);
    }

    @Override
    public DCategoriaComponente substituirPorVersaoAntiga(Integer id, Integer versionId) {
        return crudCategoriaComponente.substituirPorVersaoAntiga(id, versionId);
    }

    @Override
    public void inativar(Integer id) {
        crudCategoriaComponente.inativar(id);
    }

    @Override
    public void excluir(Integer id) {
        crudCategoriaComponente.remover(id);
    }

    private void validarRegistroDuplicado(DCategoriaComponente domain){
        Collection<DCategoriaComponente> registrosExistentes = crudCategoriaComponente.pesquisarPorDescricao(domain.getDescricao());

        for (DCategoriaComponente existente : registrosExistentes) {
            if (!existente.getCodigo().equals(Optional.ofNullable(domain.getCodigo()).orElse(-1))) {
                if (DSituacaoEnum.ATIVO.equals(existente.getSituacao())) {
                    throw new RegistroDuplicadoException("Verifique o campo descrição.");
                } else if (DSituacaoEnum.INATIVO.equals(existente.getSituacao())){
                    throw new RegistroDuplicadoException("Já existe um registro inativo com essa descrição. Reative-o antes de criar um novo.");
                } else if (DSituacaoEnum.LIXEIRA.equals(existente.getSituacao())){
                    throw new RegistroDuplicadoException("Já existe um registro com essa descrição na lixeira. Reative-o antes de criar um novo.");
                }
            }
        }
    }
}
