package br.com.todeschini.persistence.entities.publico;

import br.com.todeschini.domain.metadata.Entidade;
import br.com.todeschini.persistence.entities.enums.TipoPinturaEnum;
import br.com.todeschini.persistence.entities.enums.converters.TipoPinturaEnumConverter;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.Convert;
import jakarta.persistence.Entity;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Entidade
public class Pintura extends Material {

    @Convert(converter = TipoPinturaEnumConverter.class)
    private TipoPinturaEnum tipoPintura;
}
