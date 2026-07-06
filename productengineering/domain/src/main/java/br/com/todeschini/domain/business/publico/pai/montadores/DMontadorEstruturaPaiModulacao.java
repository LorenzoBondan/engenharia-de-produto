package br.com.todeschini.domain.business.publico.pai.montadores;

import br.com.todeschini.domain.business.publico.cor.DCor;
import br.com.todeschini.domain.business.publico.material.DMaterial;
import br.com.todeschini.domain.business.publico.medidas.DMedidas;
import br.com.todeschini.domain.business.publico.pai.DPai;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.domain.validation.NamedValidator;
import br.com.todeschini.domain.validation.ValidationBuilder;
import br.com.todeschini.domain.validation.impl.DataFuturaValidator;
import br.com.todeschini.domain.validation.impl.ObjetoNaoNuloValidator;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DMontadorEstruturaPaiModulacao {

    private DPai paiPrincipal;
    private DMedidas medidasPaiPrincipal;

    private List<DItemModulacao> paisSecundarios = new ArrayList<>();

    private List<DCor> cores = new ArrayList<>();
    private List<DMaterial> materiais = new ArrayList<>();

    private LocalDate implantacao;
    private List<DAcessorioQuantidade> acessoriosQuantidades = new ArrayList<>();

    public void validar() throws ValidationException {
        paiPrincipal.validar();
        medidasPaiPrincipal.validar();
        for(DItemModulacao pai : paisSecundarios){
            pai.validar();
        }
        for(DCor cor : cores){
            cor.validar();
        }
        for(DAcessorioQuantidade acessorio : acessoriosQuantidades){
            acessorio.validar();
        }
        new ValidationBuilder()
                .add(new NamedValidator<>("Cores", new ObjetoNaoNuloValidator()), this.cores)
                .add(new NamedValidator<>("Medidas pai principal", new ObjetoNaoNuloValidator()), this.medidasPaiPrincipal)
                .add(new NamedValidator<>("Implantação", new DataFuturaValidator()), this.implantacao)
                .validate();
    }
}
