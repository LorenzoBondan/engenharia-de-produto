package br.com.todeschini.persistence.entities.publico;

import br.com.todeschini.domain.metadata.Entidade;
import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;

@Getter
@Setter
@Entity
@DiscriminatorValue("ColaUsada")
@Entidade
public class ColaUsada extends MaterialUsado {

    public ColaUsada(){
        this.setUnidadeMedida("KG");
    }
}
