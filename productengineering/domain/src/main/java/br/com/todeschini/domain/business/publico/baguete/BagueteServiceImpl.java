package br.com.todeschini.domain.business.publico.baguete;

import br.com.todeschini.domain.ConversaoValores;
import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.baguete.api.BagueteService;
import br.com.todeschini.domain.business.publico.baguete.spi.CrudBaguete;
import br.com.todeschini.domain.business.publico.history.DHistory;
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
public class BagueteServiceImpl implements BagueteService {

    private final CrudBaguete crudBaguete;
    private final ConversaoValores conversaoValores;

    public BagueteServiceImpl(CrudBaguete crudBaguete, ConversaoValores conversaoValores) {
        this.crudBaguete = crudBaguete;
        this.conversaoValores = conversaoValores;
    }

    @Override
    public Paged<DBaguete> buscar(PageableRequest request) {
        return crudBaguete.buscarTodos(request);
    }

    @Override
    public DBaguete buscar(Integer id) {
        return crudBaguete.buscar(id);
    }

    @Override
    public List<DHistory<DBaguete>> buscarHistorico(Integer id) {
        return crudBaguete.buscarHistorico(id);
    }

    @Override
    public List<String> buscarAtributosEditaveisEmLote() {
        return crudBaguete.buscarAtributosEditaveisEmLote();
    }

    @Override
    public DBaguete incluir(DBaguete domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudBaguete.inserir(domain);
    }

    @Override
    public DBaguete atualizar(DBaguete domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudBaguete.atualizar(domain);
    }

    @Override
    public List<DBaguete> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores) {
        if (atributos.size() != valores.size()) {
            throw new BadRequestException("O número de atributos e valores deve ser igual.");
        }

        List<DBaguete> lista = codigos.stream()
                .map(this::buscar)
                .toList();

        for (DBaguete obj : lista) {
            for (int i = 0; i < atributos.size(); i++) {
                String nomeAtributo = atributos.get(i);
                Object valorAtributo = valores.get(i);

                Field field;
                try {
                    field = conversaoValores.buscarCampoNaHierarquia(DBaguete.class, nomeAtributo);
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

        return crudBaguete.atualizarEmLote(lista);
    }

    @Override
    public DBaguete substituirPorVersaoAntiga(Integer id, Integer versionId) {
        return crudBaguete.substituirPorVersaoAntiga(id, versionId);
    }

    @Override
    public void inativar(Integer id) {
        crudBaguete.inativar(id);
    }

    @Override
    public void excluir(Integer id) {
        crudBaguete.remover(id);
    }

    private void validarRegistroDuplicado(DBaguete domain){
        Collection<DBaguete> registrosExistentes = crudBaguete.pesquisarPorDescricao(domain.getDescricao());

        for (DBaguete existente : registrosExistentes) {
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
