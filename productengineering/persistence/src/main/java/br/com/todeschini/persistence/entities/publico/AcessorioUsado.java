package br.com.todeschini.persistence.entities.publico;

import br.com.todeschini.domain.metadata.Entidade;
import lombok.*;

import jakarta.persistence.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(of = "cdacessorioUsado", callSuper = false)
@Entity
@Table(name = "tb_acessorio_usado")
@Entidade
public class AcessorioUsado extends AuditoriaInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cdacessorioUsado;

    @ManyToOne
    @JoinColumn(name = "cdacessorio")
    private Acessorio acessorio;

    @ManyToOne
    @JoinColumn(name = "cdfilho")
    private Filho filho;

    private Integer quantidade;
    private Double valor;
    private String unidadeMedida = "UN";

    public AcessorioUsado(Integer cdacessorioUsado) {
        this.cdacessorioUsado = cdacessorioUsado;
    }
}
