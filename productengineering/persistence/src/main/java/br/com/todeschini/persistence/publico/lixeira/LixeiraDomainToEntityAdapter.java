package br.com.todeschini.persistence.publico.lixeira;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.lixeira.DLixeira;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.enums.SituacaoEnum;
import br.com.todeschini.persistence.entities.publico.Lixeira;
import org.springframework.stereotype.Component;

@Component
@EntityAdapter(entityClass = Lixeira.class)
public class LixeiraDomainToEntityAdapter implements Convertable<Lixeira, DLixeira> {

    @Override
    public Lixeira toEntity(DLixeira domain) {
        return Lixeira.builder()
                .id(domain.getId())
                .nometabela(domain.getNometabela())
                .data(domain.getData())
                .entidadeid(domain.getEntidadeid())
                .usuario(domain.getUsuario())
                .tabela(domain.getTabela())
                .situacao(SituacaoEnum.valueOf(domain.getSituacao().name()))
                .build();
    }

    @Override
    public DLixeira toDomain(Lixeira entity) {
        return DLixeira.builder()
                .id(entity.getId())
                .nometabela(entity.getNometabela())
                .data(entity.getData())
                .entidadeid(entity.getEntidadeid())
                .usuario(entity.getUsuario())
                .tabela(entity.getTabela())
                .situacao(DSituacaoEnum.valueOf(entity.getSituacao().name()))
                .build();
    }
}
