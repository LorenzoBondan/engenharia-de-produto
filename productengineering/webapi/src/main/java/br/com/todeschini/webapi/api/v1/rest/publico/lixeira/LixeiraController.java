package br.com.todeschini.webapi.api.v1.rest.publico.lixeira;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.business.publico.lixeira.api.LixeiraService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lixeira")
public class LixeiraController {

    private final LixeiraService service;

    public LixeiraController(LixeiraService service) {
        this.service = service;
    }

    /**
     * @param colunas representam as colunas da tabela a serem pesquisadas
     * @param operacoes representam se as comparações serão de igualdade, maior que, menor que ou diferente de
     * @param valores representam os valores a serem usados como parâmetro de busca
     * @param page atributo da paginação, representa o número da página da busca
     * @param pageSize atributo da paginação, representa o total de elementos em uma página
     * @param sort atributo da paginação, representa a ordenação
     */
    @Operation(summary = "Pesquisar todas as Lixeiras por colunas, operações e valores", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok", content = @Content(mediaType = "application/json", schema = @Schema(
                    example = """
                    {
                        "numberOfElements": 150,
                        "page": 0,
                        "totalPages": 15,
                        "size": 10,
                        "first": true,
                        "last": false,
                        "sortedBy": "codigo;d",
                         "content": []
                    }
                    """))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<?> pesquisar(
            @RequestParam(value = "colunas") List<String> colunas,
            @RequestParam(value = "operacoes", required = false, defaultValue = "=") List<String> operacoes,
            @RequestParam(value = "valores", required = false) List<String> valores,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "sort") List<String> sort) {

        if (valores == null || valores.isEmpty()) {
            valores = List.of("");
        }

        return ResponseEntity.ok(
                service.buscar(PageableRequest.builder()
                        .page(page)
                        .pageSize(pageSize)
                        .sort(sort.toArray(String[]::new))
                        .colunas(colunas)
                        .operacoes(operacoes)
                        .valores(valores)
                        .columnMap(Map.of(
                                "id", "id",
                                "nometabela", "nometabela",
                                "data", "data",
                                "entidadeid", "entidadeid",
                                "usuario", "usuario",
                                "tabela", "tabela",
                                "situacao", "situacao"))
                        .build())
        );
    }

    @Operation(summary = "Recupera um item da lixeira por id, juntamente com suas dependências ou não", method = "GET", description = "Muda o status do objeto de 'Lixeira' para 'Ativo'")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Not found")
    })
    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    @GetMapping(value = "/recuperar/{id}")
    public ResponseEntity<?> recuperar(@PathVariable("id") Integer id, @RequestParam("recuperarDependencias") Boolean recuperarDependencias){
        service.recuperar(id, recuperarDependencias);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Recupera um item da lixeira pelo id do objeto, juntamente com suas dependências ou não", method = "POST", description = "Muda o status do objeto de 'Lixeira' para 'Ativo'")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Not found")
    })
    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    @PostMapping(value = "/recuperarporentidadeid")
    public ResponseEntity<?> recuperarPorEntidadeId(@RequestBody Map<String, Object> entidadeid,
                                                    @RequestParam("recuperarDependencias") Boolean recuperarDependencias){
        service.recuperarPorEntidadeId(entidadeid, recuperarDependencias);
        return ResponseEntity.ok().build();
    }
}
