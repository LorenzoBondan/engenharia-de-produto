package br.com.todeschini.persistence.entities.publico;

import jakarta.persistence.*;
import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "cduserAnexo", callSuper = false)
@Entity
@Table(name = "tb_user_anexo")
public class UserAnexo extends AuditoriaInfo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer cduserAnexo;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cdanexo")
	private Anexo anexo;

	public UserAnexo(Integer cduserAnexo) {
		this.cduserAnexo = cduserAnexo;
	}
}
