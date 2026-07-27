package br.com.todeschini.persistence.entities.publico;

import br.com.todeschini.persistence.entities.enums.SituacaoEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(of = "id")
@Entity
@Table(name = "tb_lixeira", schema = "public")
public class Lixeira {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull
    @Size(max = 50)
    private String nometabela;
    @NotNull
    private LocalDateTime data;
    @NotNull
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(unique = true)
    private Map<String, Object> entidadeid;
    @NotNull
    @Size(max = 50)
    private String usuario;
    @NotNull
    @Enumerated(EnumType.STRING)
    private SituacaoEnum situacao;
    @NotNull
    @Size(max = 200)
    private String tabela;
}
