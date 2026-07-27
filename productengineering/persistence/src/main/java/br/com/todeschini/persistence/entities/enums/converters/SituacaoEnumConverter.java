package br.com.todeschini.persistence.entities.enums.converters;

import br.com.todeschini.persistence.entities.enums.SituacaoEnum;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class SituacaoEnumConverter implements AttributeConverter<SituacaoEnum, String> {

    @Override
    public String convertToDatabaseColumn(SituacaoEnum attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getLabel().toUpperCase();
    }

    @Override
    public SituacaoEnum convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return SituacaoEnum.valueOf(dbData.toUpperCase());
    }
}

