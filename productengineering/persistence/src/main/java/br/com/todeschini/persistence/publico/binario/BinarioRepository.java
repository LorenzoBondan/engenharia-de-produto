package br.com.todeschini.persistence.publico.binario;

import br.com.todeschini.persistence.entities.publico.Binario;
import org.springframework.data.repository.CrudRepository;

public interface BinarioRepository extends CrudRepository<Binario, Integer> {
}
