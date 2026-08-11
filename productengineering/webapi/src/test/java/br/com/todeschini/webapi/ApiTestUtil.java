package br.com.todeschini.webapi;

import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

public class ApiTestUtil {

    public static void performRequest(MockMvc mockMvc, HttpMethod method, String url, String jsonBody, String accessToken, ResultMatcher expectedStatus) throws Exception {
        MockHttpServletRequestBuilder request;

        if (method.equals(HttpMethod.GET)) {
            request = get(url).content(jsonBody);
        } else if (method.equals(HttpMethod.POST)) {
            request = post(url).content(jsonBody);
        } else if (method.equals(HttpMethod.PUT)) {
            request = put(url).content(jsonBody);
        } else if (method.equals(HttpMethod.PATCH)) {
            request = patch(url).content(jsonBody);
        } else if (method.equals(HttpMethod.DELETE)) {
            request = delete(url);
        } else {
            throw new IllegalArgumentException("Invalid HTTP method: " + method);
        }

        request.header("Authorization", authenticate(accessToken))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON);

        mockMvc.perform(request)
                .andExpect(expectedStatus);
    }

    private static String authenticate(String accessToken) {
        return "Bearer " + accessToken;
    }
}
