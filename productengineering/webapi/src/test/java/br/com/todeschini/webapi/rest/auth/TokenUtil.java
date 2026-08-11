package br.com.todeschini.webapi.rest.auth;

import br.com.todeschini.webapi.UserTest;
import com.jayway.jsonpath.JsonPath;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Component
public class TokenUtil {

    public String obtainAccessToken(MockMvc mockMvc, UserTest userTest) throws Exception {
        return obtainToken(mockMvc, userTest.getUsername(), userTest.getPassword());
    }

    private String obtainToken(MockMvc mockMvc, String email, String senha) throws Exception {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("username", email);
        formData.add("password", senha);
        formData.add("grant_type", "password");

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/oauth2/token")
                        .params(formData)
                        .header("Content-Type", "application/x-www-form-urlencoded")
                        .header("Authorization", "Basic bXljbGllbnRpZDpteWNsaWVudHNlY3JldA=="))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.access_token").exists())
                .andDo(MockMvcResultHandlers.print())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        return JsonPath.parse(responseBody).read("$.access_token");
    }
}
