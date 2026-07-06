package br.com.todeschini.domain.business.publico.medidas;

import br.com.todeschini.domain.ConversaoValores;
import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.medidas.api.MedidasService;
import br.com.todeschini.domain.business.publico.medidas.spi.CrudMedidas;
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
public class MedidasServiceImpl implements MedidasService {

    private final CrudMedidas crudMedidas;
    private final ConversaoValores conversaoValores;

    public MedidasServiceImpl(CrudMedidas crudMedidas, ConversaoValores conversaoValores) {
        this.crudMedidas = crudMedidas;
        this.conversaoValores = conversaoValores;
    }

    @Override
    public Paged<DMedidas> buscar(PageableRequest request) {
        return crudMedidas.buscarTodos(request);
    }

    @Override
    public DMedidas buscar(Integer id) {
        return crudMedidas.buscar(id);
    }

    @Override
    public Collection<? extends DMedidas> buscarPorAlturaELarguraEEspessura(Integer altura, Integer largura, Integer espessura) {
        return crudMedidas.pesquisarPorAlturaELarguraEEspessura(altura, largura, espessura);
    }

    @Override
    public List<DHistory<DMedidas>> buscarHistorico(Integer id) {
        return crudMedidas.buscarHistorico(id);
    }

    @Override
    public List<String> buscarAtributosEditaveisEmLote() {
        return crudMedidas.buscarAtributosEditaveisEmLote();
    }

    @Override
    public DMedidas incluir(DMedidas domain) {
        domain.validar();
        validarRegistroDuplicado(domain);
        return crudMedidas.inserir(domain);
    }

    @Override
    public DMedidas atualizar(DMedidas domain) {
        domain.validar();
        validarRegistroDuplicado(domain);
        return crudMedidas.atualizar(domain);
    }

    @Override
    public List<DMedidas> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores) {
        if (atributos.size() != valores.size()) {
            throw new BadRequestException("O número de atributos e valores deve ser igual.");
        }

        List<DMedidas> lista = codigos.stream()
                .map(this::buscar)
                .toList();

        for (DMedidas obj : lista) {
            for (int i = 0; i < atributos.size(); i++) {
                String nomeAtributo = atributos.get(i);
                Object valorAtributo = valores.get(i);

                Field field;
                try {
                    field = conversaoValores.buscarCampoNaHierarquia(DMedidas.class, nomeAtributo);
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

        return crudMedidas.atualizarEmLote(lista);
    }

    @Override
    public DMedidas substituirPorVersaoAntiga(Integer id, Integer versionId) {
        return crudMedidas.substituirPorVersaoAntiga(id, versionId);
    }

    @Override
    public void inativar(Integer id) {
        crudMedidas.inativar(id);
    }

    @Override
    public void excluir(Integer id) {
        crudMedidas.remover(id);
    }

    private void validarRegistroDuplicado(DMedidas domain){
        Collection<DMedidas> registrosExistentes = crudMedidas.pesquisarPorAlturaELarguraEEspessura(
                domain.getAltura(), domain.getLargura(), domain.getEspessura()
        );

        for (DMedidas existente : registrosExistentes) {
            if (!existente.getCodigo().equals(Optional.ofNullable(domain.getCodigo()).orElse(-1))) {
                if (DSituacaoEnum.ATIVO.equals(existente.getSituacao())) {
                    throw new UniqueConstraintViolationException("Registro duplicado para a combinação de Altura, Largura e Espessura.");
                } else if (DSituacaoEnum.INATIVO.equals(existente.getSituacao())){
                    throw new UniqueConstraintViolationException("Já existe um registro inativo com essa combinação de Altura, Largura e Espessura. Reative-o antes de criar um novo.");
                } else if (DSituacaoEnum.LIXEIRA.equals(existente.getSituacao())){
                    throw new UniqueConstraintViolationException("Já existe um registro com essa combinação de de Altura, Largura e Espessura na lixeira. Reative-o antes de criar um novo.");
                }
            }
        }
    }
}
