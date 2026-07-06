package br.com.todeschini.domain.business.publico.useranexo;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.auth.authservice.api.AuthService;
import br.com.todeschini.domain.business.publico.anexo.DAnexo;
import br.com.todeschini.domain.business.publico.anexo.api.AnexoService;
import br.com.todeschini.domain.business.publico.binario.DBinario;
import br.com.todeschini.domain.business.publico.binario.api.BinarioService;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.useranexo.api.UserAnexoService;
import br.com.todeschini.domain.business.publico.useranexo.spi.CrudUserAnexo;
import br.com.todeschini.domain.metadata.DomainService;

import java.util.List;

@DomainService
public class UserAnexoServiceImpl implements UserAnexoService {

    private final CrudUserAnexo crudUserAnexo;
    private final AuthService authService;
    private final BinarioService binarioService;
    private final AnexoService anexoService;

    public UserAnexoServiceImpl(CrudUserAnexo crudUserAnexo, AuthService authService, BinarioService binarioService, AnexoService anexoService) {
        this.crudUserAnexo = crudUserAnexo;
        this.authService = authService;
        this.binarioService = binarioService;
        this.anexoService = anexoService;
    }

    @Override
    public Paged<DUserAnexo> buscar(PageableRequest request) {
        return crudUserAnexo.buscarTodos(request);
    }

    @Override
    public DUserAnexo buscar(Integer id) {
        return crudUserAnexo.buscar(id);
    }

    @Override
    public List<DHistory<DUserAnexo>> buscarHistorico(Integer id) {
        return crudUserAnexo.buscarHistorico(id);
    }

    @Override
    public DUserAnexo incluir(DUserAnexoPersist domain) {
        authService.validateSelfOrAdmin(domain.getUser().getId());
        domain.validate();

        DBinario binario = binarioService.incluir(new DBinario(null, domain.getBytes(), null));
        DAnexo anexo = anexoService.incluir(
                new DAnexo(
                        null, binario, domain.getName(), domain.getMimeType(), null
                )
        );
        return crudUserAnexo.inserir(DUserAnexo.builder()
                .anexo(anexo)
                .user(domain.getUser())
                .build());
    }

    @Override
    public DUserAnexo atualizar(DUserAnexoPersist domain) {
        authService.validateSelfOrAdmin(domain.getUser().getId());
        domain.validate();

        DUserAnexo userAnexo = buscar(domain.getCodigo());

        if (domain.getBytes() != null) {
            DBinario binario = userAnexo.getAnexo().getBinario();
            binario.setBytes(domain.getBytes());
            binarioService.atualizar(binario);
        }

        DAnexo anexo = userAnexo.getAnexo();
        anexo.setNome(domain.getName());
        anexo.setMimeType(domain.getMimeType());
        anexoService.atualizar(anexo);

        return crudUserAnexo.atualizar(DUserAnexo.builder()
                .codigo(domain.getCodigo())
                .user(domain.getUser())
                .anexo(anexo)
                .build());
    }

    @Override
    public void inativar(Integer id) {
        crudUserAnexo.inativar(id);
    }

    @Override
    public void excluir(Integer id) {
        crudUserAnexo.remover(id);
    }
}
