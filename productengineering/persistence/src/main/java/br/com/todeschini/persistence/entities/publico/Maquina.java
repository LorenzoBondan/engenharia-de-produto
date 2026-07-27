package br.com.todeschini.persistence.entities.publico;

import br.com.todeschini.domain.metadata.Entidade;
import lombok.*;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(of = "cdmaquina", callSuper = false)
@Entity
@Table(name = "tb_maquina")
@Entidade
public class Maquina extends AuditoriaInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cdmaquina;
    private String nome;
    private String formula;
    private Double valor;

    @ManyToOne
    @JoinColumn(name = "cdgrupo_maquina")
    private GrupoMaquina grupoMaquina;

    @OneToMany(mappedBy = "maquina")
    private List<RoteiroMaquina> roteiroMaquinas = new ArrayList<>();

    public Maquina(Integer cdmaquina) {
        this.cdmaquina = cdmaquina;
    }
}
