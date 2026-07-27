package br.com.todeschini.persistence.entities.publico;

import br.com.todeschini.domain.metadata.Entidade;
import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Getter
@Setter
@Entity
@DiscriminatorValue("TntUsado")
@Entidade
public class TntUsado extends MaterialUsado {

    public TntUsado(){
        this.setUnidadeMedida("M²");
    }
}
