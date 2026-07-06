package br.com.todeschini.domain.exceptions.handlers;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomError {

    private LocalDateTime timestamp;
    private Integer status;
    private String error;
    private String path;
}
