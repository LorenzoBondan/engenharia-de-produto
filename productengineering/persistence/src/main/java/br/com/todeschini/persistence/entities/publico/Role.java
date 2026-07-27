package br.com.todeschini.persistence.entities.publico;

import jakarta.persistence.*;

import br.com.todeschini.domain.metadata.Entidade;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(of = "id")
@Entity
@Table(name = "tb_role")
@Entidade
public class Role implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String authority;
}
