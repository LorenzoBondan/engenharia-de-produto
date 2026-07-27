package br.com.todeschini.persistence.processadores;

import br.com.todeschini.domain.business.processadores.MaterialProcessador;
import br.com.todeschini.domain.business.processadores.MaterialProcessadorFactory;
import br.com.todeschini.persistence.entities.enums.TipoMaterialEnum;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class MaterialProcessadorFactoryImpl implements MaterialProcessadorFactory {

    private final Map<String, MaterialProcessador> processadores;

    public MaterialProcessadorFactoryImpl(
            ChapaMDPProcessadorImpl chapaProcessor, FitaBordaProcessadorImpl fitaBordaProcessador,
            ColaProcessadorImpl colaProcessador, CantoneiraProcessadorImpl cantoneiraProcessador,
            TntProcessadorImpl tntProcessador, PolietilenoProcessadorImpl polietilenoProcessador,
            PlasticoProcessadorImpl plasticoProcessador, PinturaProcessadorImpl pinturaProcessador,
            PinturaBordaFundoProcessadorImpl pinturaBordaFundoProcessador, PoliesterProcessadorImpl poliesterProcessador,
            ChapaMDFProcessadorImpl chapaMDFProcessador, BagueteProcessadorImpl bagueteProcessadorImpl
        ) {
        this.processadores = new HashMap<>();
        processadores.put(TipoMaterialEnum.CHAPA_MDP.toString(), chapaProcessor);
        processadores.put(TipoMaterialEnum.FITA_BORDA.toString(), fitaBordaProcessador);
        processadores.put(TipoMaterialEnum.COLA.toString(), colaProcessador);
        processadores.put(TipoMaterialEnum.CANTONEIRA.toString(), cantoneiraProcessador);
        processadores.put(TipoMaterialEnum.TNT.toString(), tntProcessador);
        processadores.put(TipoMaterialEnum.POLIETILENO.toString(), polietilenoProcessador);
        processadores.put(TipoMaterialEnum.PLASTICO.toString(), plasticoProcessador);
        processadores.put(TipoMaterialEnum.PINTURA.toString(), pinturaProcessador);
        processadores.put(TipoMaterialEnum.PINTURA_DE_BORDA_DE_FUNDO.toString(), pinturaBordaFundoProcessador);
        processadores.put(TipoMaterialEnum.POLIESTER.toString(), poliesterProcessador);
        processadores.put(TipoMaterialEnum.CHAPA_MDF.toString(), chapaMDFProcessador);
        processadores.put(TipoMaterialEnum.BAGUETE.toString(), bagueteProcessadorImpl);
    }

    public MaterialProcessador getProcessador(String materialType) {
        return Optional.ofNullable(processadores.get(materialType))
                .orElseThrow(() -> new IllegalArgumentException("Tipo de material desconhecido: " + materialType));
    }
}
