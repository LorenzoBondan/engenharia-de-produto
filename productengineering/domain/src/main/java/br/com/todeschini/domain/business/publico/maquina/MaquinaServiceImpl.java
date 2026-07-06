package br.com.todeschini.domain.business.publico.maquina;

import br.com.todeschini.domain.ConversaoValores;
import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.maquina.api.MaquinaService;
import br.com.todeschini.domain.business.publico.maquina.spi.CrudMaquina;
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
public class MaquinaServiceImpl implements MaquinaService {

    private final CrudMaquina crudMaquina;
    private final ConversaoValores conversaoValores;

    public MaquinaServiceImpl(CrudMaquina crudMaquina, ConversaoValores conversaoValores) {
        this.crudMaquina = crudMaquina;
        this.conversaoValores = conversaoValores;
    }

    @Override
    public Paged<DMaquina> buscar(PageableRequest request) {
        return crudMaquina.buscarTodos(request);
    }

    @Override
    public DMaquina buscar(Integer id) {
        return crudMaquina.buscar(id);
    }

    @Override
    public List<DHistory<DMaquina>> buscarHistorico(Integer id) {
        return crudMaquina.buscarHistorico(id);
    }

    @Override
    public List<String> buscarAtributosEditaveisEmLote() {
        return crudMaquina.buscarAtributosEditaveisEmLote();
    }

    @Override
    public DMaquina incluir(DMaquina domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudMaquina.inserir(domain);
    }

    @Override
    public DMaquina atualizar(DMaquina domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudMaquina.atualizar(domain);
    }

    @Override
    public List<DMaquina> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores) {
        if (atributos.size() != valores.size()) {
            throw new BadRequestException("O número de atributos e valores deve ser igual.");
        }

        List<DMaquina> lista = codigos.stream()
                .map(this::buscar)
                .toList();

        for (DMaquina obj : lista) {
            for (int i = 0; i < atributos.size(); i++) {
                String nomeAtributo = atributos.get(i);
                Object valorAtributo = valores.get(i);

                Field field;
                try {
                    field = conversaoValores.buscarCampoNaHierarquia(DMaquina.class, nomeAtributo);
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

        return crudMaquina.atualizarEmLote(lista);
    }

    @Override
    public DMaquina substituirPorVersaoAntiga(Integer id, Integer versionId) {
        return crudMaquina.substituirPorVersaoAntiga(id, versionId);
    }

    @Override
    public void inativar(Integer id) {
        crudMaquina.inativar(id);
    }

    @Override
    public void excluir(Integer id) {
        crudMaquina.remover(id);
    }

    private void validarRegistroDuplicado(DMaquina domain){
        Collection<DMaquina> registrosExistentes = crudMaquina.pesquisarPorNome(domain.getDescricao());

        for (DMaquina existente : registrosExistentes) {
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
