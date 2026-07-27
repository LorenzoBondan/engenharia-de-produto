package br.com.todeschini.persistence.entities.publico;

import br.com.todeschini.domain.metadata.Entidade;
import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;

@Getter
@Setter
@Entity
@DiscriminatorValue("FitaBordaUsada")
@Entidade
public class FitaBordaUsada extends MaterialUsado {

    public FitaBordaUsada(){
        this.setUnidadeMedida("M");
    }
}
