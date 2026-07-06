package br.com.todeschini.domain.business.publico.polietilenousado;

import br.com.todeschini.domain.Descritivel;
import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;
import br.com.todeschini.domain.exceptions.ValidationException;
import br.com.todeschini.domain.metadata.Domain;
import br.com.todeschini.domain.util.FormatadorNumeros;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import static br.com.todeschini.domain.ConstantesDosMateriais.COEFICIENTE_POLIETILENO;

@Getter
@Setter
@NoArgsConstructor
@Domain
public class DPolietilenoUsado extends DMaterialUsado implements Descritivel  {

    public DPolietilenoUsado(Integer codigo){
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
        double quantidade = (((double) this.getFilho().getMedidas().getAltura() / 1000) +
                ((double) this.getFilho().getMedidas().getLargura() / 1000)) * 2 * COEFICIENTE_POLIETILENO;
        this.setQuantidadeLiquida(FormatadorNumeros.formatarQuantidade(quantidade));
        return quantidade;
    }
}
