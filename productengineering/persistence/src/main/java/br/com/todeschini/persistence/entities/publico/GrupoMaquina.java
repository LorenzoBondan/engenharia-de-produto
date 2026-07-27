package br.com.todeschini.persistence.entities.publico;

import jakarta.persistence.*;

import br.com.todeschini.domain.metadata.Entidade;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(of = "cdgrupoMaquina", callSuper = false)
@Entity
@Table(name = "tb_grupo_maquina")
@Entidade
public class GrupoMaquina extends AuditoriaInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cdgrupoMaquina;
    private String nome;

    @OneToMany(mappedBy = "grupoMaquina")
    private List<Maquina> maquinas = new ArrayList<>();

    public GrupoMaquina(Integer cdgrupoMaquina) {
        this.cdgrupoMaquina = cdgrupoMaquina;
    }
}
