package br.com.todeschini.domain.business.publico.history;

import br.com.todeschini.domain.metadata.Domain;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Domain
public class DTHistory {

    @EqualsAndHashCode.Include
    private Integer id;
    private LocalDateTime tstamp;
    private String schemaname;
    private String tabname;
    private String operation;
    private Map<String, Object> oldVal;
    private Map<String, Object> diff;
}
