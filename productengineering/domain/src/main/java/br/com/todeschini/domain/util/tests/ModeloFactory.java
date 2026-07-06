package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.publico.modelo.DModelo;

public class ModeloFactory {

    public static DModelo createDModelo() {
        DModelo Modelo = new DModelo();
        Modelo.setCodigo(1);
        Modelo.setDescricao("Descrição");
        return Modelo;
    }

    public static DModelo createDuplicatedDModelo(String duplicatedDescription) {
        DModelo Modelo = new DModelo();
        Modelo.setCodigo(2);
        Modelo.setDescricao(duplicatedDescription);
        return Modelo;
    }

    public static DModelo createNonExistingDModelo(Integer nonExistingId) {
        DModelo Modelo = new DModelo();
        Modelo.setCodigo(nonExistingId);
        Modelo.setDescricao("Descrição");
        return Modelo;
    }
}
