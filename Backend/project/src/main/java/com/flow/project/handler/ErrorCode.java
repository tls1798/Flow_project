package com.flow.project.handler;

import lombok.Getter;
import org.springframework.http.HttpStatus;

public enum ErrorCode {

    UsernameOrPasswordNotFoundException (400, "아이디 또는 비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST),
    FailPwException (400, "일치하는 이메일이 없습니다.", HttpStatus.BAD_REQUEST),
    UserExistsException (400, "이미 가입된 회원이 있습니다.", HttpStatus.BAD_REQUEST),
    FailMessageException (400, "메일 서비스 설정이 잘못되었습니다.", HttpStatus.BAD_REQUEST),
    UNAUTHORIZEDException (401, "로그인 후 이용 가능합니다.", HttpStatus.UNAUTHORIZED),
    ExpiredJwtException(401, "Access 토큰이 만료되었습니다.", HttpStatus.UNAUTHORIZED),
    AccessBroken(401, "Access 토큰이 유효하지 않습니다.", HttpStatus.UNAUTHORIZED),
    RefreshBroken(401, "Refresh 토큰이 유효하지 않습니다.", HttpStatus.UNAUTHORIZED),
    ReLogin(401, "모든 토큰이 만료되었습니다. 다시 로그인해 주세요.", HttpStatus.UNAUTHORIZED),
    ;

    @Getter
    private int code;

    @Getter
    private String message;

    @Getter
    private HttpStatus status;

    ErrorCode(int code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
}
