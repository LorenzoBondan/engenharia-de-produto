package br.com.todeschini.domain.business.publico.lixeira;

import br.com.todeschini.domain.business.enums.DSituacaoEnum;
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
public class DLixeira {

    @EqualsAndHashCode.Include
    private Integer id;
    private String nometabela;
    private LocalDateTime data;
    private Map<String, Object> entidadeid;
    private String usuario;
    private DSituacaoEnum situacao;
    private String tabela;
}
