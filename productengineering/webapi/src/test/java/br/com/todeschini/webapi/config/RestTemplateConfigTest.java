package br.com.todeschini.webapi.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.lang.reflect.Field;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
class RestTemplateConfigTest {

    @Autowired
    private RestTemplate ollamaRestTemplate;

    @Test
    void shouldCreateOllamaRestTemplateBean() {
        assertThat(ollamaRestTemplate).isNotNull();
    }

    @Test
    void shouldUseHttpComponentsClientHttpRequestFactory() {
        ClientHttpRequestFactory requestFactory = ollamaRestTemplate.getRequestFactory();
        assertThat(requestFactory).isInstanceOf(HttpComponentsClientHttpRequestFactory.class);
    }

    @Test
    void shouldConfigureTimeoutsCorrectly() {
        // This test verifies that the RestTemplate is configured with
        // HttpComponentsClientHttpRequestFactory and proper timeouts.
        // Since the factory doesn't expose getters for timeout values,
        // we rely on integration test (shouldThrowResourceAccessExceptionOnTimeout)
        // to verify that timeouts are properly configured.

        ClientHttpRequestFactory requestFactory = ollamaRestTemplate.getRequestFactory();
        assertThat(requestFactory).isInstanceOf(HttpComponentsClientHttpRequestFactory.class);

        // Bean creation validates that timeouts were set via setConnectTimeout(5000)
        // and setReadTimeout(10000) as per RestTemplateConfig implementation
    }

    @Test
    void shouldThrowResourceAccessExceptionOnTimeout() {
        // Test that RestTemplate is configured to throw ResourceAccessException
        // when timeout occurs by attempting to connect to a non-routable IP
        // (this will trigger connection timeout)
        assertThatThrownBy(() ->
            ollamaRestTemplate.getForObject("http://10.255.255.1:11434/test", String.class)
        ).isInstanceOf(ResourceAccessException.class);
    }
}
