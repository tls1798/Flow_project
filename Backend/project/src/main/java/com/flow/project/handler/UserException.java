package com.flow.project.handler;

import org.springframework.http.HttpStatus;

public class UserException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private HttpStatus status;
    private int code;
    private String message;

    public UserException(ErrorCode errorCode) {
        this.status = errorCode.getStatus();
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
    }
    public int getCode() {
        return code;
    }
    public HttpStatus getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

}
