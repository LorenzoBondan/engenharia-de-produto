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
@EqualsAndHashCode(of = "cdcor", callSuper = false)
@Entity
@Table(name = "tb_cor")
@Entidade
public class Cor extends AuditoriaInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cdcor;
    private String descricao;
    private String hexa;

    @OneToMany(mappedBy = "cor", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<Filho> filhos = new ArrayList<>();

    @OneToMany(mappedBy = "cor", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<Material> materiais = new ArrayList<>();

    public Cor(Integer cdcor) {
        this.cdcor = cdcor;
    }
}
