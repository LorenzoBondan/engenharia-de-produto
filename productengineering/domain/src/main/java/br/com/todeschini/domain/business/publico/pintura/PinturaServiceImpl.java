package br.com.todeschini.domain.business.publico.pintura;

import br.com.todeschini.domain.ConversaoValores;
import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.pintura.api.PinturaService;
import br.com.todeschini.domain.business.publico.pintura.spi.CrudPintura;
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
public class PinturaServiceImpl implements PinturaService {

    private final CrudPintura crudPintura;
    private final ConversaoValores conversaoValores;

    public PinturaServiceImpl(CrudPintura crudPintura, ConversaoValores conversaoValores) {
        this.crudPintura = crudPintura;
        this.conversaoValores = conversaoValores;
    }

    @Override
    public Paged<DPintura> buscar(PageableRequest request) {
        return crudPintura.buscarTodos(request);
    }

    @Override
    public DPintura buscar(Integer id) {
        return crudPintura.buscar(id);
    }

    @Override
    public List<DHistory<DPintura>> buscarHistorico(Integer id) {
        return crudPintura.buscarHistorico(id);
    }

    @Override
    public List<String> buscarAtributosEditaveisEmLote() {
        return crudPintura.buscarAtributosEditaveisEmLote();
    }

    @Override
    public DPintura incluir(DPintura domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudPintura.inserir(domain);
    }

    @Override
    public DPintura atualizar(DPintura domain) {
        validarRegistroDuplicado(domain);
        domain.validar();
        return crudPintura.atualizar(domain);
    }

    @Override
    public List<DPintura> atualizarEmLote(List<Integer> codigos, List<String> atributos, List<Object> valores) {
        if (atributos.size() != valores.size()) {
            throw new BadRequestException("O número de atributos e valores deve ser igual.");
        }

        List<DPintura> lista = codigos.stream()
                .map(this::buscar)
                .toList();

        for (DPintura obj : lista) {
            for (int i = 0; i < atributos.size(); i++) {
                String nomeAtributo = atributos.get(i);
                Object valorAtributo = valores.get(i);

                Field field;
                try {
                    field = conversaoValores.buscarCampoNaHierarquia(DPintura.class, nomeAtributo);
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

        return crudPintura.atualizarEmLote(lista);
    }

    @Override
    public DPintura substituirPorVersaoAntiga(Integer id, Integer versionId) {
        return crudPintura.substituirPorVersaoAntiga(id, versionId);
    }

    @Override
    public void inativar(Integer id) {
        crudPintura.inativar(id);
    }

    @Override
    public void excluir(Integer id) {
        crudPintura.remover(id);
    }

    private void validarRegistroDuplicado(DPintura domain){
        Collection<DPintura> registrosExistentes = crudPintura.pesquisarPorTipoPinturaECor(domain.getTipoPintura().getValue(), domain.getCor().getCodigo());

        for (DPintura existente : registrosExistentes) {
            if (!existente.getCodigo().equals(Optional.ofNullable(domain.getCodigo()).orElse(-1))) {
                if (DSituacaoEnum.ATIVO.equals(existente.getSituacao())) {
                    throw new UniqueConstraintViolationException("Registro duplicado para a combinação de tipo pintura e cor.");
                } else if (DSituacaoEnum.INATIVO.equals(existente.getSituacao())){
                    throw new UniqueConstraintViolationException("Já existe um registro inativo com essa combinação de tipo pintura e cor. Reative-o antes de criar um novo.");
                } else if (DSituacaoEnum.LIXEIRA.equals(existente.getSituacao())){
                    throw new UniqueConstraintViolationException("Já existe um registro com essa combinação de tipo pintura e cor na lixeira. Reative-o antes de criar um novo.");
                }
            }
        }
    }
}
