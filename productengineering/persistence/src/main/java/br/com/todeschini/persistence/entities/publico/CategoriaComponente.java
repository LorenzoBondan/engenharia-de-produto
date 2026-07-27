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
@EqualsAndHashCode(of = "cdcategoriaComponente", callSuper = false)
@Entity
@Table(name = "tb_categoria_componente")
@Entidade
public class CategoriaComponente extends AuditoriaInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cdcategoriaComponente;
    private String descricao;

    @OneToMany(mappedBy = "categoriaComponente", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<Pai> pais = new ArrayList<>();

    public CategoriaComponente(Integer cdcategoriaComponente) {
        this.cdcategoriaComponente = cdcategoriaComponente;
    }
}
