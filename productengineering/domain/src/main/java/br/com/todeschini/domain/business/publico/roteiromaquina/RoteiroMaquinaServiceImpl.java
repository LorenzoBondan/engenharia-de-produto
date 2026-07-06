package br.com.todeschini.domain.business.publico.roteiromaquina;

import br.com.todeschini.domain.ConversaoValores;
import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.roteiromaquina.api.RoteiroMaquinaService;
import br.com.todeschini.domain.business.publico.roteiromaquina.spi.CrudRoteiroMaquina;
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
public class RoteiroMaquinaServiceImpl implements RoteiroMaquinaService {

    private final CrudRoteiroMaquina crudRoteiroMaquina;
    private final ConversaoValores conversaoValores;

    public RoteiroMaquinaServiceImpl(CrudRoteiroMaquina crudRoteiroMaquina, ConversaoValores conversaoValores) {
        this.crudRoteiroMaquina = crudRoteiroMaquina;
        this.conversaoValores = conversaoValores;
    }

    @Override
    public Paged<DRoteiroMaquina> buscar(PageableRequest request) {
        return crudRoteiroMaquina.buscarTodos(request);
    }

    @Override
    public DRoteiroMaquina buscar(Integer id) {
        return crudRoteiroMaquina.buscar(id);
    }

    @Override
    public List<DHistory<DRoteiroMaquina>> buscarHistorico(Integer id) {
        return crudRoteiroMaquina.buscarHistorico(id);
    }

    @Override
    public List<String> buscarAtributosEditaveisEmLote() {
        return crudRoteiroMaquina.buscarAtributosEditaveisEmLote();
    }

    @Override
    public DRoteiroMaquina incluir(DRoteiroMaquina domain) {
        domain.validar();
        validarRegistroDuplicado(domain);
        return crudRoteiroMaquina.inserir(domain);
    }

    @Override
    public DRoteiroMaquina atualizar(DRoteiroMaquina domain) {
        domain.validar();
        validarRegistroDuplicado(domain);
        return crudRoteiroMaquina.atualizar(domain);
    }

    @Override
    public List<DRoteiroMaquina> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores) {
        if (atributos.size() != valores.size()) {
            throw new BadRequestException("O número de atributos e valores deve ser igual.");
        }

        List<DRoteiroMaquina> lista = codigos.stream()
                .map(this::buscar)
                .toList();

        for (DRoteiroMaquina obj : lista) {
            for (int i = 0; i < atributos.size(); i++) {
                String nomeAtributo = atributos.get(i);
                Object valorAtributo = valores.get(i);

                Field field;
                try {
                    field = conversaoValores.buscarCampoNaHierarquia(DRoteiroMaquina.class, nomeAtributo);
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

        return crudRoteiroMaquina.atualizarEmLote(lista);
    }

    @Override
    public DRoteiroMaquina substituirPorVersaoAntiga(Integer id, Integer versionId) {
        return crudRoteiroMaquina.substituirPorVersaoAntiga(id, versionId);
    }

    @Override
    public void inativar(Integer id) {
        crudRoteiroMaquina.inativar(id);
    }

    @Override
    public void excluir(Integer id) {
        crudRoteiroMaquina.remover(id);
    }

    private void validarRegistroDuplicado(DRoteiroMaquina domain){
        Collection<DRoteiroMaquina> registrosExistentes = crudRoteiroMaquina.pesquisarPorRoteiroEMaquina(
                domain.getRoteiro().getCodigo(), domain.getMaquina().getCodigo()
        );

        for (DRoteiroMaquina existente : registrosExistentes) {
            if (!existente.getCodigo().equals(Optional.ofNullable(domain.getCodigo()).orElse(-1))) {
                if (DSituacaoEnum.ATIVO.equals(existente.getSituacao())) {
                    throw new UniqueConstraintViolationException("Registro duplicado para a combinação de Roteiro e Máquina.");
                } else if (DSituacaoEnum.INATIVO.equals(existente.getSituacao())){
                    throw new UniqueConstraintViolationException("Já existe um registro inativo com essa combinação de Roteiro e Máquina. Reative-o antes de criar um novo.");
                } else if (DSituacaoEnum.LIXEIRA.equals(existente.getSituacao())){
                    throw new UniqueConstraintViolationException("Já existe um registro com essa combinação de Roteiro e Máquina na lixeira. Reative-o antes de criar um novo.");
                }
            }
        }
    }
}
