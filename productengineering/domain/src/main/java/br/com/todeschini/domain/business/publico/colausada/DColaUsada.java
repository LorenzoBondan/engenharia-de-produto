package br.com.todeschini.domain.business.publico.colausada;

import br.com.todeschini.domain.Descritivel;
import br.com.todeschini.domain.business.publico.cola.DCola;
import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;
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
public class DColaUsada extends DMaterialUsado implements Descritivel  {

    public DColaUsada(Integer codigo){
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
        double quantidadeFitaBorda = ((double) this.getFilho().getMedidas().getAltura() / 1000) *
                (double) this.getFilho().getPai().getBordasComprimento() +
                ((double) this.getFilho().getMedidas().getLargura() / 1000) * (double) this.getFilho().getPai().getBordasComprimento();

        DCola cola = (DCola) this.getMaterial();
        double quantidadeLiquida = ((double) this.getFilho().getMedidas().getEspessura() / 1000 *
                quantidadeFitaBorda * cola.getGramatura());
        this.setQuantidadeLiquida(FormatadorNumeros.formatarQuantidade(quantidadeLiquida));
        return this.getQuantidadeLiquida();
    }
}
