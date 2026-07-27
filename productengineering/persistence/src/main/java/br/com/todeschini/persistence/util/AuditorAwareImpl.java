package br.com.todeschini.persistence.util;

import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.AuditorAware;

import java.util.Optional;

public class AuditorAwareImpl implements AuditorAware<String> {

    private final CustomUserUtil customUserUtil;

    public AuditorAwareImpl(CustomUserUtil customUserUtil) {
        this.customUserUtil = customUserUtil;
    }

    @NotNull
    @Override
    public Optional<String> getCurrentAuditor() {
        return customUserUtil.getLoggedUsername().describeConstable();
    }
}
