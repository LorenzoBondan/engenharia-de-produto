package br.com.todeschini.persistence.util;

import br.com.todeschini.domain.PageableRequest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Objects;
import java.util.stream.Stream;

@Component
public class PageRequestUtils {

    public Pageable toPage(PageableRequest request){
        return PageRequest.of(request.getPage(), request.getPageSize(), getSortObject(request.getSort(), request.getColumnMap()));
    }

    private Sort getSortObject(String[] colunas, Map<String, String> columnMap){
        return Sort.by(Stream.of(colunas)
                .map(s -> toOrders(s, columnMap))
                .filter(Objects::nonNull)
                .toList());
    }

    private Sort.Order toOrders(String s, Map<String, String> columnMap) {
        if (s != null && !s.isBlank()) {
            String[] aux = s.split(";");
            if (aux.length > 0) {
                String propertyPath = aux[0];
                for (Map.Entry<String, String> entry : columnMap.entrySet()) {
                    if(entry.getKey().equals(propertyPath)) {
                        propertyPath = propertyPath.replace(entry.getKey(), entry.getValue());
                        break;
                    }
                }
                Sort.Direction direction = (aux.length > 1 && aux[1].equalsIgnoreCase("d")) ? Sort.Direction.DESC : Sort.Direction.ASC;
                return new Sort.Order(direction, propertyPath);
            }
        }
        return null;
    }
}
