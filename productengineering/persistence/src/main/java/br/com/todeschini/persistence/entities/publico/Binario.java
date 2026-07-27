package br.com.todeschini.persistence.entities.publico;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(of = "cdbinario", callSuper = false)
@Entity
@Table(name = "tb_binario")
public class Binario extends AuditoriaInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cdbinario;
    private byte[] bytes;

    @OneToMany(mappedBy = "binario", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<Anexo> anexos = new ArrayList<>();

    public Binario(Integer cdbinario) {
        this.cdbinario = cdbinario;
    }
}
