package br.com.todeschini.domain.projections;

public interface UserDetailsProjection {
    String getUsername();
    String getPassword();
    Integer getRoleId();
    String getAuthority();
}
