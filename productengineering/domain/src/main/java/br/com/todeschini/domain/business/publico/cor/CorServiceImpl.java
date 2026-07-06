package br.com.todeschini.domain.business.publico.cor;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.cor.api.CorService;
import br.com.todeschini.domain.business.publico.cor.spi.CrudCor;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.exceptions.RegistroDuplicadoException;
import br.com.todeschini.domain.metadata.DomainService;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@DomainService
public class CorServiceImpl implements CorService {

    private final CrudCor crudCor;

    public CorServiceImpl(CrudCor crudCor) {
        this.crudCor = crudCor;
    }

    @Override
    public Paged<DCor> buscar(PageableRequest request) {
        return crudCor.buscarTodos(request);
    }

    @Override
    public DCor buscar(Integer id) {
        return crudCor.buscar(id);
    }

    @Override
    public List<DHistory<DCor>> buscarHistorico(Integer id) {
        return crudCor.buscarHistorico(id);
    }

    @Override
    public DCor incluir(DCor domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudCor.inserir(domain);
    }

    @Override
    public DCor atualizar(DCor domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudCor.atualizar(domain);
    }

    @Override
    public DCor substituirPorVersaoAntiga(Integer id, Integer versionId) {
        return crudCor.substituirPorVersaoAntiga(id, versionId);
    }

    @Override
    public void inativar(Integer id) {
        crudCor.inativar(id);
    }

    @Override
    public void excluir(Integer id) {
        crudCor.remover(id);
    }

    private void validarRegistroDuplicado(DCor domain){
        Collection<DCor> registrosExistentes = crudCor.pesquisarPorDescricao(domain.getDescricao());

        for (DCor existente : registrosExistentes) {
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
