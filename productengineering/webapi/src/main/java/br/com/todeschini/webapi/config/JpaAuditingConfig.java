package br.com.todeschini.webapi.config;

import br.com.todeschini.persistence.util.AuditorAwareImpl;
import br.com.todeschini.persistence.util.CustomUserUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class JpaAuditingConfig {

    private final CustomUserUtil customUserUtil;

    public JpaAuditingConfig(CustomUserUtil customUserUtil) {
        this.customUserUtil = customUserUtil;
    }

    @Bean
    public AuditorAware<String> auditorAware() {
        return new AuditorAwareImpl(customUserUtil);
    }
}
