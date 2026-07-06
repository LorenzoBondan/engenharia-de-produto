package br.com.todeschini.domain;

public interface Convertable<E, D>{
    E toEntity(D domain);
    D toDomain(E entity);
}
