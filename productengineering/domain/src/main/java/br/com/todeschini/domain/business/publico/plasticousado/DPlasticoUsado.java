package br.com.todeschini.domain.business.publico.plasticousado;

import br.com.todeschini.domain.Descritivel;
import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;
import br.com.todeschini.domain.business.publico.plastico.DPlastico;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.domain.metadata.Domain;
import br.com.todeschini.domain.util.FormatadorNumeros;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Domain
public class DPlasticoUsado extends DMaterialUsado implements Descritivel  {

    public DPlasticoUsado(Integer codigo){
        this.setCodigo(codigo);
    }

    @Override
    public void validar() throws ValidationException {
        super.validar();
    }

    @Override
    public String getDescricao() {
        return super.getDescricao();
    }

    @Override
    public Double calcularQuantidadeLiquida(){
        double quantidade;
        double maiorMedida;
        DPlastico plastico = (DPlastico) this.getMaterial();
        if(this.getFilho().getMedidas().getAltura() >= this.getFilho().getMedidas().getLargura()){
            maiorMedida = this.getFilho().getMedidas().getAltura();
        } else{
            maiorMedida = this.getFilho().getMedidas().getLargura();
        }
        if(this.getFilho().getPai().getPlasticoAcima()){
            quantidade = (maiorMedida + this.getFilho().getPai().getPlasticoAdicional()) / 1000 *
                    ((double) this.getFilho().getPai().getLarguraPlastico() / 1000) * plastico.getGramatura();
        } else{
            quantidade = maiorMedida / 1000 * ((double) this.getFilho().getPai().getLarguraPlastico() / 1000)
                    * plastico.getGramatura();
        }
        this.setQuantidadeLiquida(FormatadorNumeros.formatarQuantidade(quantidade));
        return quantidade;
    }
}
