package br.com.todeschini.persistence.entities.publico;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import br.com.todeschini.domain.metadata.Entidade;
import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "cdroteiroMaquina", callSuper = false)
@Getter
@Setter
@Entity
@Table(name = "tb_roteiro_maquina")
@Entidade
public class RoteiroMaquina extends AuditoriaInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cdroteiroMaquina;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "cdroteiro")
    private Roteiro roteiro;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "cdmaquina")
    private Maquina maquina;

    private Double tempoMaquina;
    private Double tempoHomem;
    private String unidadeMedida = "MIN";

    public RoteiroMaquina(Integer cdroteiroMaquina) {
        this.cdroteiroMaquina = cdroteiroMaquina;
    }
}
