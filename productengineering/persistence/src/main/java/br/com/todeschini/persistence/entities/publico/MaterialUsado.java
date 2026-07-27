package br.com.todeschini.persistence.entities.publico;

import br.com.todeschini.domain.metadata.Entidade;
import lombok.*;

import jakarta.persistence.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(of = "cdmaterialUsado", callSuper = false)
@Entity
@Table(name = "tb_material_usado")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "dtype", discriminatorType = DiscriminatorType.STRING)
@Entidade
public class MaterialUsado extends AuditoriaInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cdmaterialUsado;

    @ManyToOne
    @JoinColumn(name = "cdfilho")
    private Filho filho;

    @ManyToOne
    @JoinColumn(name = "cdmaterial")
    private Material material;

    private Double valor;
    private Double quantidadeLiquida;
    private Double quantidadeBruta;
    private String unidadeMedida;

    public MaterialUsado(Integer cdmaterialUsado) {
        this.cdmaterialUsado = cdmaterialUsado;
    }
}
