package br.com.todeschini.persistence.entities.enums.converters;

import br.com.todeschini.persistence.entities.enums.TipoPinturaEnum;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TipoPinturaEnumConverter implements AttributeConverter<TipoPinturaEnum, Integer> {

    @Override
    public Integer convertToDatabaseColumn(TipoPinturaEnum attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValue();
    }

    @Override
    public TipoPinturaEnum convertToEntityAttribute(Integer dbData) {
        if (dbData == null) {
            return null;
        }
        return TipoPinturaEnum.fromValue(dbData);
    }
}

