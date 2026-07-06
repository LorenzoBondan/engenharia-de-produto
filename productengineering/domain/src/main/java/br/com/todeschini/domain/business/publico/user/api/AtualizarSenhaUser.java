package br.com.todeschini.domain.business.publico.user.api;

public interface AtualizarSenhaUser {

    void updatePassword (String newPassword, String oldPassword);
}
