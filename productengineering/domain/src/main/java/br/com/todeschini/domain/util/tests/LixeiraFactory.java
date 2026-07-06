package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.lixeira.DLixeira;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

public class LixeiraFactory {

    public static DLixeira createDLixeira() {
        DLixeira lixeira = new DLixeira();
        lixeira.setId(1);
        lixeira.setData(LocalDateTime.now());
        Map<String, Object> map = new HashMap<>();
        map.put("id", 1);
        lixeira.setEntidadeid(map);
        lixeira.setTabela("tabela");
        lixeira.setNometabela("nometabela");
        lixeira.setUsuario("usuario");
        lixeira.setSituacao(DSituacaoEnum.LIXEIRA);
        return lixeira;
    }

    public static DLixeira createDuplicatedDLixeira() {
        DLixeira lixeira = new DLixeira();
        lixeira.setId(2);
        lixeira.setData(LocalDateTime.now());
        Map<String, Object> map = new HashMap<>();
        map.put("id", 1);
        lixeira.setEntidadeid(map);
        lixeira.setTabela("tabela");
        lixeira.setNometabela("nometabela");
        lixeira.setUsuario("usuario");
        lixeira.setSituacao(DSituacaoEnum.LIXEIRA);
        return lixeira;
    }

    public static DLixeira createNonExistingDLixeira(Integer nonExistingId) {
        DLixeira lixeira = new DLixeira();
        lixeira.setId(nonExistingId);
        lixeira.setData(LocalDateTime.now());
        Map<String, Object> map = new HashMap<>();
        map.put("id", 1);
        lixeira.setEntidadeid(map);
        lixeira.setTabela("tabela");
        lixeira.setNometabela("nometabela");
        lixeira.setUsuario("usuario");
        lixeira.setSituacao(DSituacaoEnum.LIXEIRA);
        return lixeira;
    }
}
