package br.com.todeschini.domain.business.publico.history;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.history.api.HistoryService;
import br.com.todeschini.domain.business.publico.history.spi.HistoryOperations;
import br.com.todeschini.domain.metadata.DomainService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@DomainService
public class HistoryServiceImpl implements HistoryService {

    private final HistoryOperations historyOperations;

    public HistoryServiceImpl(HistoryOperations historyOperations) {
        this.historyOperations = historyOperations;
    }

    @Override
    public <T> List<DHistory<T>> getHistoryEntityByRecord(Class<T> entityType, String tabname, String recordId, Map<String, Class<?>> attributeMappings) {
        return historyOperations.getHistoryEntityByRecord(entityType, tabname, recordId, attributeMappings);
    }

    @Override
    public Paged<DTHistory> buscar(String tabname, LocalDateTime dataInicial, LocalDateTime dataFinal, String operation, String idName, String recordId, PageableRequest pageable) {
        return historyOperations.buscar(tabname, dataInicial, dataFinal, operation, idName, recordId, pageable);
    }
}
