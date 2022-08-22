package com.flow.project.service;

import com.flow.project.domain.AuthDTO;
import com.flow.project.handler.ErrorCode;
import com.flow.project.handler.UserException;
import com.flow.project.jwt.JwtProvider;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtProvider jwtProvider;
    private final AuthenticationManager authenticationManager;

    // 로그인
    public Map<String, Object> login(AuthDTO.LoginDTO loginDTO) {
        Map<String, Object> result = new HashMap<>();
        // UsernamePasswordAuthenticationToken 해당 요청을 처리할 수 있는 AuthenticationProvider  찾아 인증을 시도
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDTO.getMemMail(), loginDTO.getMemPw()));

            // access token 과 refresh 토큰을 생성한다.
            Map createToken = jwtProvider.createToken(loginDTO);
            result.put("memNo", createToken.get("memNo"));
            result.put("accessToken", createToken.get("accessToken"));
            result.put("refreshToken", createToken.get("refreshToken"));
        } catch (Exception e) {
            throw new UserException(ErrorCode.UsernameOrPasswordNotFoundException);
        }
        return result;
    }

    // 토큰 재발급
    public Map<String, Object> reissue(AuthDTO.GetNewAccessTokenDTO getNewAccessTokenDTO, HttpServletRequest request) {
        return jwtProvider.reissue(getNewAccessTokenDTO, request);
    }

    // 프론트 인가를 위함
    public Map<String, Object> validtokencheck(String accessToken) {
        Map<String, Object> result = new HashMap<>();
        try {
            Jwts.parser().setSigningKey("${jwt.secretA}").parseClaimsJws(accessToken);
        } catch (ExpiredJwtException e) {
            result.put("error", "ExpiredJwtException");
        }
        return result;
    }
}



