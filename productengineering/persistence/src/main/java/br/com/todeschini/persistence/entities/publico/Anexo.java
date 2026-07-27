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
@EqualsAndHashCode(of = "cdanexo", callSuper = false)
@Entity
@Table(name = "tb_anexo")
public class Anexo extends AuditoriaInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cdanexo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cdbinario")
    private Binario binario;

    private String nome;
    private String mimeType;

    @OneToMany(mappedBy = "anexo", fetch = FetchType.LAZY)
    private List<UserAnexo> userAnexos = new ArrayList<>();

    public Anexo(Integer cdanexo) {
        this.cdanexo = cdanexo;
    }
}
