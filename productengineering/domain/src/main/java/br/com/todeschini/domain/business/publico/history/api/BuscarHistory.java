package br.com.todeschini.domain.business.publico.history.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.history.DTHistory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface BuscarHistory {

    <T> List<DHistory<T>> getHistoryEntityByRecord(Class<T> entityType, String tabname, String recordId, Map<String, Class<?>> attributeMappings);

    Paged<DTHistory> buscar(String tabname,
                            LocalDateTime dataInicial,
                            LocalDateTime dataFinal,
                            String operation,
                            String idName,
                            String recordId,
                            PageableRequest pageableRequest);
}
