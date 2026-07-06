package br.com.todeschini.domain;

public interface PagedSearch<T>{

    <T> T search(PageableRequest request);
}
