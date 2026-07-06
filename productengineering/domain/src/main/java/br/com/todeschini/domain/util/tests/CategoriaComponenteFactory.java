package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.publico.categoriacomponente.DCategoriaComponente;

public class CategoriaComponenteFactory {

    public static DCategoriaComponente createDCategoriaComponente() {
        DCategoriaComponente CategoriaComponente = new DCategoriaComponente();
        CategoriaComponente.setCodigo(1);
        CategoriaComponente.setDescricao("Descrição");
        return CategoriaComponente;
    }

    public static DCategoriaComponente createDuplicatedDCategoriaComponente(String duplicatedDescription) {
        DCategoriaComponente CategoriaComponente = new DCategoriaComponente();
        CategoriaComponente.setCodigo(2);
        CategoriaComponente.setDescricao(duplicatedDescription);
        return CategoriaComponente;
    }

    public static DCategoriaComponente createNonExistingDCategoriaComponente(Integer nonExistingId) {
        DCategoriaComponente CategoriaComponente = new DCategoriaComponente();
        CategoriaComponente.setCodigo(nonExistingId);
        CategoriaComponente.setDescricao("Descrição");
        return CategoriaComponente;
    }
}
