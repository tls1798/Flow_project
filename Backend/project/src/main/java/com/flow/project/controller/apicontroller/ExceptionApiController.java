package com.flow.project.controller.apicontroller;


import com.flow.project.handler.UserException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;


@RestControllerAdvice
public class ExceptionApiController {

    @ExceptionHandler(UserException.class)
    public ResponseEntity<?> LoginException(UserException e) {
        Map<String, Object> result = new HashMap<>();
        result.put("code", e.getCode());
        result.put("message", e.getMessage());
        return ResponseEntity.status(e.getStatus()).body(result);
    }
}
