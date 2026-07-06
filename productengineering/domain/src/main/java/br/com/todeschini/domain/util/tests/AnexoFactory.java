package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.publico.anexo.DAnexo;
import br.com.todeschini.domain.business.publico.binario.DBinario;

public class AnexoFactory {

    public static DAnexo createDAnexo() {
        DAnexo Anexo = new DAnexo();
        Anexo.setCodigo(1);
        Anexo.setBinario(new DBinario(1));
        Anexo.setNome("anexo");
        Anexo.setMimeType("image/jpeg");
        return Anexo;
    }

    public static DAnexo createDuplicatedDAnexo() {
        DAnexo Anexo = new DAnexo();
        Anexo.setCodigo(2);
        Anexo.setBinario(new DBinario(1));
        Anexo.setNome("anexo");
        Anexo.setMimeType("image/jpeg");
        return Anexo;
    }

    public static DAnexo createNonExistingDAnexo(Integer nonExistingId) {
        DAnexo Anexo = new DAnexo();
        Anexo.setCodigo(nonExistingId);
        Anexo.setBinario(new DBinario(1));
        Anexo.setNome("anexo");
        Anexo.setMimeType("image/jpeg");
        return Anexo;
    }
}
