package br.com.todeschini.domain.business.publico.cantoneirausada;

import br.com.todeschini.domain.Descritivel;
import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.domain.metadata.Domain;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Domain
public class DCantoneiraUsada extends DMaterialUsado implements Descritivel  {

    public DCantoneiraUsada(Integer codigo){
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
        this.setQuantidadeLiquida((double) this.getFilho().getPai().getNumeroCantoneiras());
        return this.getQuantidadeLiquida();
    }
}
