package br.com.todeschini.domain.business.publico.polietileno;

import br.com.todeschini.domain.ConversaoValores;
import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.polietileno.api.PolietilenoService;
import br.com.todeschini.domain.business.publico.polietileno.spi.CrudPolietileno;
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
public class PolietilenoServiceImpl implements PolietilenoService {

    private final CrudPolietileno crudPolietileno;
    private final ConversaoValores conversaoValores;

    public PolietilenoServiceImpl(CrudPolietileno crudPolietileno, ConversaoValores conversaoValores) {
        this.crudPolietileno = crudPolietileno;
        this.conversaoValores = conversaoValores;
    }

    @Override
    public Paged<DPolietileno> buscar(PageableRequest request) {
        return crudPolietileno.buscarTodos(request);
    }

    @Override
    public DPolietileno buscar(Integer id) {
        return crudPolietileno.buscar(id);
    }

    @Override
    public List<DHistory<DPolietileno>> buscarHistorico(Integer id) {
        return crudPolietileno.buscarHistorico(id);
    }

    @Override
    public List<String> buscarAtributosEditaveisEmLote() {
        return crudPolietileno.buscarAtributosEditaveisEmLote();
    }

    @Override
    public DPolietileno incluir(DPolietileno domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudPolietileno.inserir(domain);
    }

    @Override
    public DPolietileno atualizar(DPolietileno domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudPolietileno.atualizar(domain);
    }

    @Override
    public List<DPolietileno> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores) {
        if (atributos.size() != valores.size()) {
            throw new BadRequestException("O número de atributos e valores deve ser igual.");
        }

        List<DPolietileno> lista = codigos.stream()
                .map(this::buscar)
                .toList();

        for (DPolietileno obj : lista) {
            for (int i = 0; i < atributos.size(); i++) {
                String nomeAtributo = atributos.get(i);
                Object valorAtributo = valores.get(i);

                Field field;
                try {
                    field = conversaoValores.buscarCampoNaHierarquia(DPolietileno.class, nomeAtributo);
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

        return crudPolietileno.atualizarEmLote(lista);
    }

    @Override
    public DPolietileno substituirPorVersaoAntiga(Integer id, Integer versionId) {
        return crudPolietileno.substituirPorVersaoAntiga(id, versionId);
    }

    @Override
    public void inativar(Integer id) {
        crudPolietileno.inativar(id);
    }

    @Override
    public void excluir(Integer id) {
        crudPolietileno.remover(id);
    }

    private void validarRegistroDuplicado(DPolietileno domain){
        Collection<DPolietileno> registrosExistentes = crudPolietileno.pesquisarPorDescricao(domain.getDescricao());

        for (DPolietileno existente : registrosExistentes) {
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
