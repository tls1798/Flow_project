package com.flow.project.domain;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import java.util.Date;

public class AuthDTO {

    /**
     * 로그인 시 사용하는 DTO
     */
    @Getter
    @Setter
    public static class LoginDTO {
        int memNo;
        @NotBlank
        @ApiModelProperty(value = "아이디", example = "admin@naver.com", required = true)
        private String memMail;

        @NotBlank
        @ApiModelProperty(value = "비밀번호", example = "12345", required = true)
        private String memPw;
    }

    /**
     * Refresh Token을 사용하여 새로운 Access Token을 발급받을 때 사용하는 DTO
     */
    @Getter
    @Setter
    public static class GetNewAccessTokenDTO {

        private String accessToken;
        private String refreshToken;
    }

}
