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
@EqualsAndHashCode(of = "cdacessorio", callSuper = false)
@Entity
@Table(name = "tb_acessorio")
@Entidade
public class Acessorio extends AuditoriaInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cdacessorio;
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "cdmedidas")
    private Medidas medidas;

    @ManyToOne
    @JoinColumn(name = "cdcor")
    private Cor cor;

    private LocalDate implantacao;
    private Double valor;

    @OneToMany(mappedBy = "acessorio", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<AcessorioUsado> acessoriosUsados = new ArrayList<>();

    public Acessorio(Integer cdacessorio) {
        this.cdacessorio = cdacessorio;
    }
}
