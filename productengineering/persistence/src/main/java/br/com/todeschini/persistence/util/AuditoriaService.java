package br.com.todeschini.persistence.util;

import br.com.todeschini.domain.projections.AuditoriaProjection;
import br.com.todeschini.persistence.entities.enums.SituacaoEnum;
import br.com.todeschini.persistence.entities.publico.AuditoriaInfo;
import org.springframework.stereotype.Service;

/**
 * Serviço utilizado para definir os atributos de Auditoria: criadopor, criadoem e situacao ao atualizar um objeto genérico
 */
@Service
public class AuditoriaService {

    private final AuditoriaRepository auditoriaRepository;

    public AuditoriaService(AuditoriaRepository auditoriaRepository) {
        this.auditoriaRepository = auditoriaRepository;
    }

    public <T extends AuditoriaInfo> void setCreationProperties(T obj) {
        // obtém a classe e ID da entidade
        Class<?> entityClass = obj.getClass();
        Integer id = JpaMetadataUtils.extractId(obj);

        if (id == null) {
            throw new IllegalArgumentException("O ID da entidade " + entityClass.getSimpleName() + " não pode ser nulo.");
        }

        // recupera os dados de auditoria e preenche o objeto
        AuditoriaProjection auditoria = auditoriaRepository.findAuditoriaById(entityClass, id);
        obj.setCriadoem(auditoria.criadoEm());
        obj.setCriadopor(auditoria.criadoPor());
        obj.setSituacao(SituacaoEnum.valueOf(auditoria.situacao()));
    }
}
