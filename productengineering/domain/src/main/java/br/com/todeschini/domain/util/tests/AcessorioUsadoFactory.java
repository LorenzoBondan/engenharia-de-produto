package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.publico.acessorio.DAcessorio;
import br.com.todeschini.domain.business.publico.acessoriousado.DAcessorioUsado;
import br.com.todeschini.domain.business.publico.filho.DFilho;

public class AcessorioUsadoFactory {

    public static DAcessorioUsado createDAcessorioUsado() {
        DAcessorioUsado acessorioUsado = new DAcessorioUsado();
        acessorioUsado.setCodigo(1);
        acessorioUsado.setAcessorio(new DAcessorio(100));
        acessorioUsado.setFilho(new DFilho(100));
        acessorioUsado.setQuantidade(1);
        acessorioUsado.setValor(10.0);
        return acessorioUsado;
    }

    public static DAcessorioUsado createDuplicatedDAcessorioUsado(Integer duplicatedId) {
        DAcessorioUsado acessorioUsado = new DAcessorioUsado();
        acessorioUsado.setCodigo(2);
        acessorioUsado.setAcessorio(new DAcessorio(duplicatedId));
        acessorioUsado.setFilho(new DFilho(duplicatedId));
        acessorioUsado.setQuantidade(1);
        acessorioUsado.setValor(10.0);
        return acessorioUsado;
    }

    public static DAcessorioUsado createNonExistingDAcessorioUsado(Integer nonExistingId) {
        DAcessorioUsado acessorioUsado = new DAcessorioUsado();
        acessorioUsado.setCodigo(nonExistingId);
        acessorioUsado.setAcessorio(new DAcessorio(100));
        acessorioUsado.setFilho(new DFilho(100));
        acessorioUsado.setQuantidade(1);
        acessorioUsado.setValor(10.0);
        return acessorioUsado;
    }
}
