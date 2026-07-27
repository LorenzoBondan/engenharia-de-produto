package br.com.todeschini.persistence.entities.publico;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

@Builder
@EqualsAndHashCode(of = "id")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "t_history")
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private LocalDateTime tstamp;
    private String schemaname;
    private String tabname;
    private String operation;
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> oldVal;
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> diff;
}
