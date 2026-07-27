package br.com.todeschini.persistence.entities.publico;

import br.com.todeschini.domain.metadata.Entidade;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.Entity;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Entidade
public class PinturaBordaFundo extends Material {
}
