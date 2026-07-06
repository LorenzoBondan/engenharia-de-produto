package br.com.todeschini.domain.business.publico.acessoriousado;

import br.com.todeschini.domain.ConversaoValores;
import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.acessoriousado.api.AcessorioUsadoService;
import br.com.todeschini.domain.business.publico.acessoriousado.spi.CrudAcessorioUsado;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.exceptions.BadRequestException;
import br.com.todeschini.domain.exceptions.UniqueConstraintViolationException;
import br.com.todeschini.domain.metadata.BatchEditable;
import br.com.todeschini.domain.metadata.DomainService;
import br.com.todeschini.domain.metadata.Entidade;

import java.lang.reflect.Field;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@DomainService
public class AcessorioUsadoServiceImpl implements AcessorioUsadoService {

    private final CrudAcessorioUsado crudAcessorioUsado;
    private final ConversaoValores conversaoValores;

    public AcessorioUsadoServiceImpl(CrudAcessorioUsado crudAcessorioUsado, ConversaoValores conversaoValores) {
        this.crudAcessorioUsado = crudAcessorioUsado;
        this.conversaoValores = conversaoValores;
    }

    @Override
    public Paged<DAcessorioUsado> buscar(PageableRequest request) {
        return crudAcessorioUsado.buscarTodos(request);
    }

    @Override
    public DAcessorioUsado buscar(Integer id) {
        return crudAcessorioUsado.buscar(id);
    }

    @Override
    public List<DHistory<DAcessorioUsado>> buscarHistorico(Integer id) {
        return crudAcessorioUsado.buscarHistorico(id);
    }

    @Override
    public List<String> buscarAtributosEditaveisEmLote() {
        return crudAcessorioUsado.buscarAtributosEditaveisEmLote();
    }

    @Override
    public DAcessorioUsado incluir(DAcessorioUsado domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudAcessorioUsado.inserir(domain);
    }

    @Override
    public DAcessorioUsado atualizar(DAcessorioUsado domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudAcessorioUsado.atualizar(domain);
    }

    @Override
    public List<DAcessorioUsado> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores) {
        if (atributos.size() != valores.size()) {
            throw new BadRequestException("O número de atributos e valores deve ser igual.");
        }

        List<DAcessorioUsado> lista = codigos.stream()
                .map(this::buscar)
                .toList();

        for (DAcessorioUsado obj : lista) {
            for (int i = 0; i < atributos.size(); i++) {
                String nomeAtributo = atributos.get(i);
                Object valorAtributo = valores.get(i);

                Field field;
                try {
                    field = conversaoValores.buscarCampoNaHierarquia(DAcessorioUsado.class, nomeAtributo);
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

        return crudAcessorioUsado.atualizarEmLote(lista);
    }

    @Override
    public DAcessorioUsado substituirPorVersaoAntiga(Integer id, Integer versionId) {
        return crudAcessorioUsado.substituirPorVersaoAntiga(id, versionId);
    }

    @Override
    public void inativar(Integer id) {
        crudAcessorioUsado.inativar(id);
    }

    @Override
    public void excluir(Integer id) {
        crudAcessorioUsado.remover(id);
    }

    private void validarRegistroDuplicado(DAcessorioUsado domain){
        Collection<DAcessorioUsado> registrosExistentes = crudAcessorioUsado.pesquisarPorAcessorioEFilho(
                domain.getAcessorio().getCodigo(), domain.getFilho().getCodigo()
        );

        for (DAcessorioUsado existente : registrosExistentes) {
            if (!existente.getCodigo().equals(Optional.ofNullable(domain.getCodigo()).orElse(-1))) {
                if (DSituacaoEnum.ATIVO.equals(existente.getSituacao())) {
                    throw new UniqueConstraintViolationException("Registro duplicado para a combinação de Filho e Acessório.");
                } else if (DSituacaoEnum.INATIVO.equals(existente.getSituacao())){
                    throw new UniqueConstraintViolationException("Já existe um registro inativo com essa combinação de Filho e Acessório. Reative-o antes de criar um novo.");
                } else if (DSituacaoEnum.LIXEIRA.equals(existente.getSituacao())){
                    throw new UniqueConstraintViolationException("Já existe um registro com essa combinação de Filho e Acessório na lixeira. Reative-o antes de criar um novo.");
                }
            }
        }
    }
}
