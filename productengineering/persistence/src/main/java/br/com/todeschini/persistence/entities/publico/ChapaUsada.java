package br.com.todeschini.persistence.entities.publico;

import br.com.todeschini.domain.metadata.Entidade;
import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;

@Getter
@Setter
@Entity
@DiscriminatorValue("ChapaUsada")
@Entidade
public class ChapaUsada extends MaterialUsado {

    public ChapaUsada(){
        this.setUnidadeMedida("M²");
    }
}
