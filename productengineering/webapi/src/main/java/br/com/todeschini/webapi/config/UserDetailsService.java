package br.com.todeschini.webapi.config;

import br.com.todeschini.domain.projections.UserDetailsProjection;
import br.com.todeschini.persistence.entities.publico.Role;
import br.com.todeschini.persistence.entities.publico.User;
import br.com.todeschini.persistence.publico.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    @Autowired
    private UserRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        List<UserDetailsProjection> result = repository.searchUserAndRolesByEmail(username);
        if (result.isEmpty()) {
            throw new UsernameNotFoundException("Email not found");
        }

        User user = new User();
        user.setEmail(result.get(0).getUsername());
        user.setPassword(result.get(0).getPassword());
        for (UserDetailsProjection projection : result) {
            user.getRoles().add(new Role(projection.getRoleId(), projection.getAuthority()));
        }

        return user;
    }
}
