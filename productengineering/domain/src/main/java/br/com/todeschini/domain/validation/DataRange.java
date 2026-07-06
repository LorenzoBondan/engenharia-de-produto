package br.com.todeschini.domain.validation;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DataRange {

    private LocalDate dataInicial;
    private LocalDate dataFinal;
}
