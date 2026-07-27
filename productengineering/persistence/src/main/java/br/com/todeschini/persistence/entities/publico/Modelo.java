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
@EqualsAndHashCode(of = "cdmodelo", callSuper = false)
@Entity
@Table(name = "tb_modelo")
@Entidade
public class Modelo extends AuditoriaInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cdmodelo;
    private String descricao;

    @OneToMany(mappedBy = "modelo", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<Pai> pais = new ArrayList<>();

    public Modelo(Integer cdmodelo) {
        this.cdmodelo = cdmodelo;
    }
}
