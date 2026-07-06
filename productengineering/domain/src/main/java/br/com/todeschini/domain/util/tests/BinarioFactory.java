package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.publico.binario.DBinario;

public class BinarioFactory {

    public static DBinario createDBinario() {
        DBinario Binario = new DBinario();
        Binario.setCodigo(1);
        byte[] bytes = {};
        Binario.setBytes(bytes);
        return Binario;
    }

    public static DBinario createDuplicatedDBinario() {
        DBinario Binario = new DBinario();
        Binario.setCodigo(2);
        byte[] bytes = {};
        Binario.setBytes(bytes);
        return Binario;
    }

    public static DBinario createNonExistingDBinario(Integer nonExistingId) {
        DBinario Binario = new DBinario();
        Binario.setCodigo(nonExistingId);
        byte[] bytes = {};
        Binario.setBytes(bytes);
        return Binario;
    }
}
