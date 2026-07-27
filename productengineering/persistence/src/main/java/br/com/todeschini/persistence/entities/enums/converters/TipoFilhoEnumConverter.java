package br.com.todeschini.persistence.entities.enums.converters;

import br.com.todeschini.persistence.entities.enums.TipoFilhoEnum;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TipoFilhoEnumConverter implements AttributeConverter<TipoFilhoEnum, Integer> {

    @Override
    public Integer convertToDatabaseColumn(TipoFilhoEnum attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValue();
    }

    @Override
    public TipoFilhoEnum convertToEntityAttribute(Integer dbData) {
        if (dbData == null) {
            return null;
        }
        return TipoFilhoEnum.fromValue(dbData);
    }
}

