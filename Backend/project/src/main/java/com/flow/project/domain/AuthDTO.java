package com.flow.project.domain;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

public class AuthDTO {

    /**
     * 로그인 시 사용하는 DTO
     */
    @Getter
    @Setter
    public static class LoginDTO {

        int memNo;

        @Pattern(regexp = "^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$", message = "이메일 형식에 맞지 않습니다.")
        @NotBlank
        private String memMail;

        @Pattern(regexp = "(?=.*[0-9])(?=.*[a-z])(?=.*\\W)(?=\\S+$).{8,16}", message = "비밀번호는 8~16자 영문 소문자, 숫자, 특수문자를 사용하세요.")
        @NotBlank
        private String memPw;
    }

    /**
     * 회원가입시 사용하는 DTO
     */
    @Getter
    @Setter
    public static class SignupDTO {


        @Pattern(regexp = "^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$", message = "이메일 형식에 맞지 않습니다.")
        @NotBlank
        private String memMail;

        @NotBlank
        private String memName;

        @Pattern(regexp = "(?=.*[0-9])(?=.*[a-z])(?=.*\\W)(?=\\S+$).{8,16}", message = "비밀번호는 8~16자 영문 소문자, 숫자, 특수문자를 사용하세요.")
        @NotBlank
        private String memPw;
    }

    /**
     * 토큰을 사용하여 새로운 Access Token을 발급받을 때 사용하는 DTO
     */
    @Getter
    @Setter
    public static class GetNewAccessTokenDTO {

        private String accessToken;
        private String refreshToken;
    }

    /**
     * 이메일 인증시 사용하는 DTO
     */

    @Getter
    @Setter
    public static class EmailDTO {
        @Pattern(regexp = "^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$", message = "이메일 형식에 맞지 않습니다.")
        @NotBlank
        private String memMail;
    }
}
