package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.publico.categoriacomponente.DCategoriaComponente;
import br.com.todeschini.domain.business.publico.modelo.DModelo;
import br.com.todeschini.domain.business.publico.pai.DPai;

public class PaiFactory {

    public static DPai createDPai() {
        DPai pai = new DPai();
        pai.setCodigo(1);
        pai.setModelo(new DModelo(100));
        pai.setCategoriaComponente(new DCategoriaComponente(100));
        pai.setDescricao("Descrição");
        pai.setBordasComprimento(1);
        pai.setBordasLargura(1);
        pai.setNumeroCantoneiras(4);
        pai.setTntUmaFace(true);
        pai.setLarguraPlastico(100);
        pai.setPlasticoAcima(true);
        pai.setPlasticoAdicional(100.0);
        return pai;
    }

    public static DPai createDuplicatedDPai(String duplicatedDescription) {
        DPai pai = new DPai();
        pai.setCodigo(2);
        pai.setModelo(new DModelo(100));
        pai.setCategoriaComponente(new DCategoriaComponente(100));
        pai.setDescricao(duplicatedDescription);
        pai.setBordasComprimento(1);
        pai.setBordasLargura(1);
        pai.setNumeroCantoneiras(4);
        pai.setTntUmaFace(true);
        pai.setLarguraPlastico(100);
        pai.setPlasticoAcima(true);
        pai.setPlasticoAdicional(100.0);
        return pai;
    }

    public static DPai createNonExistingDPai(Integer nonExistingId) {
        DPai pai = new DPai();
        pai.setCodigo(nonExistingId);
        pai.setModelo(new DModelo(100));
        pai.setCategoriaComponente(new DCategoriaComponente(100));
        pai.setDescricao("Descrição");
        pai.setBordasComprimento(1);
        pai.setBordasLargura(1);
        pai.setNumeroCantoneiras(4);
        pai.setTntUmaFace(true);
        pai.setLarguraPlastico(100);
        pai.setPlasticoAcima(true);
        pai.setPlasticoAdicional(100.0);
        return pai;
    }
}
