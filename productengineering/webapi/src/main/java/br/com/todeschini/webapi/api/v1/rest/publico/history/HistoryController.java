package br.com.todeschini.webapi.api.v1.rest.publico.history;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.history.DTHistory;
import br.com.todeschini.domain.business.publico.history.api.HistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Tag(name = "History")
@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final HistoryService service;

    public HistoryController(HistoryService service) {
        this.service = service;
    }

    @Operation(summary = "Pesquisar todos os Históricos por colunas, operações e valores", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<?> pesquisar(
            @RequestParam(value = "tabname", required = false, defaultValue = "") String tabname,
            @RequestParam(value = "dataInicial", required = false, defaultValue = "0000-01-01T00:00:00") LocalDateTime dataInicial,
            @RequestParam(value = "dataFinal", required = false, defaultValue = "9999-12-31T23:59:59") LocalDateTime dataFinal,
            @RequestParam(value = "operation", required = false, defaultValue = "") String operation,
            @RequestParam(value = "idName", required = false, defaultValue = "situacao") String idName,
            @RequestParam(value = "recordId", required = false, defaultValue = "") String recordId,
            @RequestParam(value = "colunas") List<String> colunas,
            @RequestParam(value = "operacoes", required = false, defaultValue = "=") List<String> operacoes,
            @RequestParam(value = "valores", required = false) List<String> valores,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "sort") List<String> sort) {

        PageableRequest pageable = PageableRequest.builder()
                .page(page)
                .pageSize(pageSize)
                .sort(sort.toArray(String[]::new))
                .colunas(colunas)
                .operacoes(operacoes)
                .valores(valores)
                .columnMap(Map.of(
                        "id", "id",
                        "tstamp", "tstamp",
                        "schemaname", "schemaname",
                        "tabname", "tabname",
                        "operation", "operation",
                        "oldVal", "oldVal"))
                .build();

        Paged<DTHistory> pagedResult = service.buscar(
                tabname, dataInicial, dataFinal, operation, idName, recordId, pageable);

        return ResponseEntity.ok(pagedResult);
    }
}
