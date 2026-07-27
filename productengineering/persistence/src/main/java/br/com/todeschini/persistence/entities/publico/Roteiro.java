package br.com.todeschini.persistence.entities.publico;

import br.com.todeschini.domain.metadata.Entidade;
import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(of = "cdroteiro", callSuper = false)
@Entity
@Table(name = "tb_roteiro")
@Entidade
public class Roteiro extends AuditoriaInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cdroteiro;
    private String descricao;
    private LocalDate implantacao;
    private LocalDate dataFinal;
    private Double valor;

    @OneToMany(mappedBy = "roteiro", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<Filho> filhos = new ArrayList<>();

    @OneToMany(mappedBy = "roteiro", cascade = CascadeType.REMOVE)
    private List<RoteiroMaquina> roteiroMaquinas = new ArrayList<>();

    public Roteiro(Integer cdroteiro) {
        this.cdroteiro = cdroteiro;
    }
}
