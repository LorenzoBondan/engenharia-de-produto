package br.com.todeschini.persistence.publico.user;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.domain.projections.AuditoriaProjection;
import br.com.todeschini.domain.projections.UserDetailsProjection;
import br.com.todeschini.persistence.entities.publico.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;

@QueryService
public interface UserRepository extends JpaRepository<User, Integer> {

	Collection<User> findByEmail(String email);

    @Query(nativeQuery = true, value = """
				SELECT tb_user.email AS username, tb_user.password, tb_role.id AS roleId, tb_role.authority
				FROM tb_user
				INNER JOIN tb_user_role ON tb_user.id = tb_user_role.user_id
				INNER JOIN tb_role ON tb_role.id = tb_user_role.role_id
				WHERE tb_user.email = :email
			""")
    List<UserDetailsProjection> searchUserAndRolesByEmail(String email);

	@Transactional
	@Modifying
	@Query(nativeQuery = true, value = """
            UPDATE tb_user SET password = :password
            WHERE tb_user.id = :userId
            """)
	void updatePassword(@Param("password") String password, @Param("userId") Integer userId);

	@Query(nativeQuery = true, value = """
        SELECT criadopor, criadoem, situacao FROM tb_user WHERE id = :id
    """)
	AuditoriaProjection findAuditoriaById(@Param("id") Integer id);
}
