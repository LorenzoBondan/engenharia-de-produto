package br.com.todeschini.persistence.entities.publico;

import br.com.todeschini.domain.metadata.Entidade;
import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Getter
@Setter
@Entity
@DiscriminatorValue("BagueteUsado")
@Entidade
public class BagueteUsado extends MaterialUsado {

    public BagueteUsado(){
        this.setUnidadeMedida("M²");
    }
}
