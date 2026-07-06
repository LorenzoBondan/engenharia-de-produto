package br.com.todeschini.domain.business.publico.pinturabordafundo;

import br.com.todeschini.domain.ConversaoValores;
import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.pinturabordafundo.api.PinturaBordaFundoService;
import br.com.todeschini.domain.business.publico.pinturabordafundo.spi.CrudPinturaBordaFundo;
import br.com.todeschini.domain.exceptions.BadRequestException;
import br.com.todeschini.domain.exceptions.RegistroDuplicadoException;
import br.com.todeschini.domain.metadata.BatchEditable;
import br.com.todeschini.domain.metadata.DomainService;
import br.com.todeschini.domain.metadata.Entidade;

import java.lang.reflect.Field;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@DomainService
public class PinturaBordaFundoServiceImpl implements PinturaBordaFundoService {

    private final CrudPinturaBordaFundo crudPinturaBordaFundo;
    private final ConversaoValores conversaoValores;

    public PinturaBordaFundoServiceImpl(CrudPinturaBordaFundo crudPinturaBordaFundo, ConversaoValores conversaoValores) {
        this.crudPinturaBordaFundo = crudPinturaBordaFundo;
        this.conversaoValores = conversaoValores;
    }

    @Override
    public Paged<DPinturaBordaFundo> buscar(PageableRequest request) {
        return crudPinturaBordaFundo.buscarTodos(request);
    }

    @Override
    public DPinturaBordaFundo buscar(Integer id) {
        return crudPinturaBordaFundo.buscar(id);
    }

    @Override
    public List<DHistory<DPinturaBordaFundo>> buscarHistorico(Integer id) {
        return crudPinturaBordaFundo.buscarHistorico(id);
    }

    @Override
    public List<String> buscarAtributosEditaveisEmLote() {
        return crudPinturaBordaFundo.buscarAtributosEditaveisEmLote();
    }

    @Override
    public DPinturaBordaFundo incluir(DPinturaBordaFundo domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudPinturaBordaFundo.inserir(domain);
    }

    @Override
    public DPinturaBordaFundo atualizar(DPinturaBordaFundo domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudPinturaBordaFundo.atualizar(domain);
    }

    @Override
    public List<DPinturaBordaFundo> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores) {
        if (atributos.size() != valores.size()) {
            throw new BadRequestException("O número de atributos e valores deve ser igual.");
        }

        List<DPinturaBordaFundo> lista = codigos.stream()
                .map(this::buscar)
                .toList();

        for (DPinturaBordaFundo obj : lista) {
            for (int i = 0; i < atributos.size(); i++) {
                String nomeAtributo = atributos.get(i);
                Object valorAtributo = valores.get(i);

                Field field;
                try {
                    field = conversaoValores.buscarCampoNaHierarquia(DPinturaBordaFundo.class, nomeAtributo);
                    field.setAccessible(true);

                    if (field.isAnnotationPresent(BatchEditable.class)) {
                        Object valorConvertido = conversaoValores.convertValor(field.getType(), valorAtributo); // converte o Object para seu tipo de dado específico

                        // verificar se o tipo do valor convertido é uma entidade mapeada
                        if (valorConvertido != null && valorConvertido.getClass().isAnnotationPresent(Entidade.class)) {
                            // invocar o adaptador com base na entidade
                            Convertable<Object, Object> adapter = (Convertable<Object, Object>) conversaoValores.findAdapterForEntity(valorConvertido.getClass());
                            if (adapter != null) {
                                valorConvertido = adapter.toDomain(valorConvertido); // converte a entidade para o domínio
                            } else {
                                throw new BadRequestException("Nenhum adaptador encontrado para a entidade: " + valorConvertido.getClass().getName());
                            }
                        }

                        field.set(obj, valorConvertido);
                    } else {
                        throw new BadRequestException("O atributo " + nomeAtributo + " não pode ser editado em lote.");
                    }
                } catch (NoSuchFieldException | IllegalAccessException e) {
                    throw new BadRequestException("Erro ao tentar acessar o atributo " + nomeAtributo);
                }
            }
            atualizar(obj);
        }

        return crudPinturaBordaFundo.atualizarEmLote(lista);
    }

    @Override
    public DPinturaBordaFundo substituirPorVersaoAntiga(Integer id, Integer versionId) {
        return crudPinturaBordaFundo.substituirPorVersaoAntiga(id, versionId);
    }

    @Override
    public void inativar(Integer id) {
        crudPinturaBordaFundo.inativar(id);
    }

    @Override
    public void excluir(Integer id) {
        crudPinturaBordaFundo.remover(id);
    }

    private void validarRegistroDuplicado(DPinturaBordaFundo domain){
        Collection<DPinturaBordaFundo> registrosExistentes = crudPinturaBordaFundo.pesquisarPorDescricao(domain.getDescricao());

        for (DPinturaBordaFundo existente : registrosExistentes) {
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
