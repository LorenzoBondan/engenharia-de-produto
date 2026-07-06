package br.com.todeschini.domain.business.processadores;

public interface MaterialProcessadorFactory {

    MaterialProcessador getProcessador(String materialType);
}
