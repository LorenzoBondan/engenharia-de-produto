package br.com.todeschini.persistence.util;

import br.com.todeschini.domain.DomainEntityMapping;
import org.springframework.stereotype.Component;

/**
 * Classe utilizada para recuperar qual entidade se refere o domain a ser editado em lote que vêm no método de edição em lote
 */
@Component
public class DomainEntityMappingImpl implements DomainEntityMapping {

    @Override
    public Class<?> getEntityClass(Class<?> domainClass) {
        String domainClassName = domainClass.getSimpleName().substring(1); // exemplo: remove o "D" de "DChapa" para obter "Chapa"
        String entityPackage = "br.com.todeschini.persistence.entities.publico"; // pacote onde as entidades estão

        try {
            return Class.forName(entityPackage + "." + domainClassName);
        } catch (ClassNotFoundException e) {
            throw new IllegalArgumentException("Entidade não encontrada para a classe de domínio: " + domainClass.getName(), e);
        }
    }
}
