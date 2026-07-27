package br.com.todeschini.persistence.publico.history;

import br.com.todeschini.domain.Convertable;
import br.com.todeschini.domain.business.publico.history.DTHistory;
import br.com.todeschini.domain.metadata.EntityAdapter;
import br.com.todeschini.persistence.entities.publico.History;
import org.springframework.stereotype.Component;

@Component
@EntityAdapter(entityClass = History.class)
public class HistoryDomainToEntityAdapter implements Convertable<History, DTHistory> {

    @Override
    public History toEntity(DTHistory domain) {
        return History.builder()
                .id(domain.getId())
                .tstamp(domain.getTstamp())
                .schemaname(domain.getSchemaname())
                .tabname(domain.getTabname())
                .operation(domain.getOperation())
                .oldVal(domain.getOldVal())
                .diff(domain.getDiff())
                .build();
    }

    @Override
    public DTHistory toDomain(History entity) {
        return DTHistory.builder()
                .id(entity.getId())
                .tstamp(entity.getTstamp())
                .schemaname(entity.getSchemaname())
                .tabname(entity.getTabname())
                .operation(entity.getOperation())
                .oldVal(entity.getOldVal())
                .diff(entity.getDiff())
                .build();
    }
}
