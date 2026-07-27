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
@EqualsAndHashCode(of = "cdmedidas", callSuper = false)
@Entity
@Table(name = "tb_medidas")
@Entidade
public class Medidas extends AuditoriaInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cdmedidas;
    private Integer altura;
    private Integer largura;
    private Integer espessura;

    @OneToMany(mappedBy = "medidas", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<Filho> filhos = new ArrayList<>();

    @OneToMany(mappedBy = "medidas", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<Acessorio> acessorios = new ArrayList<>();

    public Medidas(Integer cdmedidas) {
        this.cdmedidas = cdmedidas;
    }
}
