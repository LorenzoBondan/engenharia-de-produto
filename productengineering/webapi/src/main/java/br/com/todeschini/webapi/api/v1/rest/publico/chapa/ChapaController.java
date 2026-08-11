package br.com.todeschini.webapi.api.v1.rest.publico.chapa;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.business.publico.chapa.DChapa;
import br.com.todeschini.domain.business.publico.chapa.api.ChapaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "Chapa")
@RestController
@RequestMapping("/api/chapa")
public class ChapaController {

    private final ChapaService service;

    public ChapaController(ChapaService service) {
        this.service = service;
    }

    /**
     * @param colunas representam as colunas da tabela a serem pesquisadas
     * @param operacoes representam se as comparações serão de igualdade, maior que, menor que ou diferente de
     * @param valores representam os valores a serem usados como parâmetros de busca
     * @param page atributo da paginação, representa o número da página da busca
     * @param pageSize atributo da paginação, representa o total de elementos em uma página
     * @param sort atributo da paginação, representa a ordenação
     */
    @Operation(summary = "Pesquisar todas as Chapas por colunas, operações e valores", method = "GET")
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
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_ANALYST', 'ROLE_OPERATOR')")
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
                                "codigo", "cdmaterial",
                                "descricao", "descricao",
                                "implantacao", "implantacao",
                                "porcentagemPerda", "porcentagemPerda",
                                "valor", "valor",
                                "espessura", "espessura",
                                "faces", "faces",
                                "situacao", "situacao"))
                        .build())
        );
    }

    /**
     * @param id representa o ID da Chapa a ser pesquisada
     */
    @Operation(summary = "Pesquisar uma Chapa por id", method = "GET", description = "Pesquisa um objeto por id, independente da sua situação")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Not found")
    })
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_ANALYST', 'ROLE_OPERATOR')")
    @GetMapping(value = "/{id}")
    public ResponseEntity<?> pesquisarPorId(@PathVariable("id") Integer id){
        return ResponseEntity.ok(service.buscar(id));
    }

    /**
     * @param codigo representa o ID da Chapa a ser pesquisada
     */
    @Operation(summary = "Pesquisar uma lista de versões de uma Chapa por id", method = "GET", description = "Pesquisa uma lista de versões por id, independente da sua situação")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_ANALYST', 'ROLE_OPERATOR')")
    @GetMapping(value = "/historico")
    public ResponseEntity<?> pesquisarHistorico(@RequestParam("codigo") Integer codigo){
        return ResponseEntity.ok(service.buscarHistorico(codigo));
    }

    @Operation(summary = "Pesquisar uma lista de atributos da Chapa que podem ser editados em lote", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_ANALYST', 'ROLE_OPERATOR')")
    @GetMapping(value = "/atributoseditaveisemlote")
    public ResponseEntity<?> pesquisarAtributosEditaveisEmLote(){
        return ResponseEntity.ok(service.buscarAtributosEditaveisEmLote());
    }

    /**
     * @param dto representa o objeto Chapa a ser criado
     */
    @Operation(summary = "Inserir uma nova Chapa", method = "POST")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Created"),
            @ApiResponse(responseCode = "400", description = "Bad Request"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "409", description = "Conflict"),
            @ApiResponse(responseCode = "422", description = "Unprocessable Entity")
    })
    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_ANALYST')")
    @PostMapping
    public ResponseEntity<?> criar(
            @RequestBody
            @Schema(
                    description = "Objeto de Chapa para criação",
                    requiredProperties = "descricao, tipoMaterial.codigo, porcentagemPerda, valor, faces, espessura",
                    example = """
                    {
                        "descricao": "Descrição",
                        "tipoMaterial": {
                            "codigo": 1,
                        },
                        "implantacao": "2024-01-01",
                        "porcentagemPerda": 12.0,
                        "valor": 50.0,
                        "cor": {
                            "codigo": 1
                        },
                        "faces": 2,
                        "espessura": 18
                    }
                    """
            )
            DChapa dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.incluir(dto));
    }

    /**
     * @param dto representa o objeto Chapa a ser atualizado
     */
    @Operation(summary = "Atualizar uma Chapa", method = "PUT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok"),
            @ApiResponse(responseCode = "400", description = "Bad Request"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "409", description = "Conflict"),
            @ApiResponse(responseCode = "422", description = "Unprocessable Entity")
    })
    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_ANALYST')")
    @PutMapping
    public ResponseEntity<?> atualizar(
            @RequestBody
            @Schema(
                    description = "Objeto de Chapa para edição",
                    requiredProperties = "codigo, descricao, tipoMaterial.codigo, porcentagemPerda, valor, faces, espessura",
                    example = """
                    {
                        "codigo": 1,
                        "descricao": "Descrição",
                        "tipoMaterial": {
                            "codigo": 1,
                        },
                        "implantacao": "2024-01-01",
                        "porcentagemPerda": 12.0,
                        "valor": 50.0,
                        "cor": {
                            "codigo": 1
                        },
                        "faces": 2,
                        "espessura": 18
                    }
                    """
            )
            DChapa dto){
        return ResponseEntity.ok(service.atualizar(dto));
    }

    /**
     *
     * @param codigos códigos das Chapas a serem editadas
     * @param atributos nomes dos atributos a serem editados
     * @param valores valores dos atributos a serem editados
     */
    @Operation(summary = "Atualizar uma lista de Chapas", method = "PUT", description = "Atualiza o(s) atributo(s) de todos os objetos da lista")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok"),
            @ApiResponse(responseCode = "400", description = "Bad Request"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Not found"),
            @ApiResponse(responseCode = "409", description = "Conflict")
    })
    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_ANALYST')")
    @PutMapping(value = "/atualizaremlote")
    public ResponseEntity<?> atualizarEmLote(@RequestParam("codigo") List<Integer> codigos,
                                             @RequestParam("atributo") List<String> atributos,
                                             @RequestParam("valor") List<Object> valores) {
        return ResponseEntity.ok(service.atualizarEmLote(codigos, atributos, valores));
    }

    /**
     * @param codigoRegistro código da Chapa a ser substituída
     * @param codigoVersao código do t_history com a versão a ser utilizada
     */
    @Operation(summary = "Substituir uma Chapa por uma versão anterior", method = "PUT", description = "O objeto tem seus campos alterados para uma versão anterior")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Not found")
    })
    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_ANALYST')")
    @PutMapping(value = "/substituir")
    public ResponseEntity<?> substituirVersao(@RequestParam("codigoRegistro") Integer codigoRegistro,
                                              @RequestParam("codigoVersao") Integer codigoVersao) {
        return ResponseEntity.ok(service.substituirPorVersaoAntiga(codigoRegistro, codigoVersao));
    }

    /**
     * @param codigos lista dos códigos das Chapas a serem inativadas
     */
    @Operation(summary = "Inativar uma lista de Chapas", method = "PATCH", description = "A situação dos objetos é alterada para 'Inativo'")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok"),
            @ApiResponse(responseCode = "206", description = "Partial content"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_ANALYST')")
    @PatchMapping(value = "/inativar")
    public ResponseEntity<?> inativar(@RequestParam("codigo") List<Integer> codigos) {
        List<Integer> alteradosComSucesso = new ArrayList<>();
        List<Map<String, Object>> falhas = new ArrayList<>();

        codigos.forEach(codigo -> {
            try {
                service.inativar(codigo);
                alteradosComSucesso.add(codigo);
            } catch (Exception e) {
                Map<String, Object> erro = new HashMap<>();
                erro.put("codigo", codigo);
                erro.put("mensagem", e.getMessage());
                falhas.add(erro);
            }
        });

        Map<String, Object> resposta = Map.of(
                "alteradosComSucesso", alteradosComSucesso,
                "falhas", falhas
        );

        return falhas.isEmpty() ? ResponseEntity.ok(resposta) : ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).body(resposta);
    }

    /**
     * @param codigos lista dos códigos das Chapas a serem excluídas
     */
    @Operation(summary = "Excluir uma lista de Chapas", method = "DELETE", description = "A situação dos objetos é alterada para 'Lixeira'")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok"),
            @ApiResponse(responseCode = "206", description = "Partial content"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_ANALYST')")
    @DeleteMapping
    public ResponseEntity<?> remover(@RequestParam("codigo") List<Integer> codigos){
        List<Integer> alteradosComSucesso = new ArrayList<>();
        List<Map<String, Object>> falhas = new ArrayList<>();

        codigos.forEach(codigo -> {
            try {
                service.excluir(codigo);
                alteradosComSucesso.add(codigo);
            } catch (Exception e) {
                Map<String, Object> erro = new HashMap<>();
                erro.put("codigo", codigo);
                erro.put("mensagem", e.getMessage());
                falhas.add(erro);
            }
        });

        Map<String, Object> resposta = Map.of(
                "alteradosComSucesso", alteradosComSucesso,
                "falhas", falhas
        );

        return falhas.isEmpty() ? ResponseEntity.ok(resposta) : ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).body(resposta);
    }
}
