package br.com.todeschini.domain;

import java.util.List;

public final class PagedBuilder<T> {
    private int numberOfElements;
    private int page;
    private int totalPages;
    private int size;
    private boolean first;
    private boolean last;
    private String sortedBy;
    private List<T> content;

    public PagedBuilder() {
    }

    public PagedBuilder<T> aPaged() {
        return new PagedBuilder<T>();
    }

    public PagedBuilder<T> withNumberOfElements(int numberOfElements) {
        this.numberOfElements = numberOfElements;
        return this;
    }

    public PagedBuilder<T> withPage(int page) {
        this.page = page;
        return this;
    }

    public PagedBuilder<T> withTotalPages(int totalPages) {
        this.totalPages = totalPages;
        return this;
    }

    public PagedBuilder<T> withSize(int size) {
        this.size = size;
        return this;
    }

    public PagedBuilder<T> withFirst(boolean first) {
        this.first = first;
        return this;
    }

    public PagedBuilder<T> withLast(boolean last) {
        this.last = last;
        return this;
    }

    public PagedBuilder<T> withSortedBy(String sortedBy) {
        this.sortedBy = sortedBy;
        return this;
    }

    public PagedBuilder<T> withContent(List<T> content) {
        this.content = content;
        return this;
    }

    public Paged<T> build() {
        Paged<T> paged = new Paged<T>();
        paged.setNumberOfElements(numberOfElements);
        paged.setPage(page);
        paged.setTotalPages(totalPages);
        paged.setSize(size);
        paged.setFirst(first);
        paged.setLast(last);
        paged.setSortedBy(sortedBy);
        paged.setContent(content);
        return paged;
    }
}
