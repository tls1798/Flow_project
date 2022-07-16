package com.flow.project.jwt;

import com.flow.project.domain.AuthDTO;
import com.flow.project.domain.RefreshToken;
import com.flow.project.repository.AuthMapper;
import com.flow.project.service.CustomUserDetailService;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.binding.BindingException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtProvider {
    private final AuthMapper authMapper;
    private final long accessExpireTime = ( 30 * 60 * 1000L);   // 30분

    private final long refreshExpireTime = (60 * 60 * 1000L) * 24;   // 24시간
    private final CustomUserDetailService customUserDetailService;
    private String mail;
    // AccessToken 생성
    public String createAccessToken(AuthDTO.LoginDTO loginDTO) {
        Map<String, Object> headers = new HashMap<>();
        headers.put("type", "token");
        mail = loginDTO.getMemMail();
        Map<String, Object> payloads = new HashMap<>();
        payloads.put("memMail", loginDTO.getMemMail());
        long now = (new Date()).getTime();
        Date accessTokenExpiresIn = new Date(now + accessExpireTime);


        String jwt = Jwts
                .builder()
                .setHeader(headers)
                .setClaims(payloads)
                .setSubject("user")
                .setExpiration(accessTokenExpiresIn)
                .signWith(SignatureAlgorithm.HS256, "${jwt.secretA}")
                .compact();

        return jwt;
    }

    // Refresh 토큰 생성
    public String refreshToken(AuthDTO.LoginDTO loginDTO) {
        Map<String, Object> headers = new HashMap<>();
        headers.put("type", "token");
        long now = (new Date()).getTime();
        Date expiration = new Date(now + refreshExpireTime);

        String jwt = Jwts
                .builder()
                .setHeader(headers)
                .setExpiration(expiration)
                .signWith(SignatureAlgorithm.HS256, "${jwt.secretB}")
                .compact();

        return jwt;
    }

    // 토큰을 생성해서 반환
    public Map<String, String> createToken(AuthDTO.LoginDTO loginDTO) {
        Map result = new HashMap();

        String accessToken = createAccessToken(loginDTO);
        String refreshToken = refreshToken(loginDTO);

        loginDTO.setMemNo(authMapper.findNo(loginDTO.getMemMail()));
        // 프론트에서 setinterval로 사용하기 위함
        String expiredAt = String.valueOf(accessExpireTime);

        result.put("memNo", loginDTO.getMemNo());
        result.put("expiredAt", expiredAt);
        result.put("accessToken", accessToken);
        result.put("refreshToken", refreshToken);
        RefreshToken insertOrUpdateRefreshToken = RefreshToken.builder()
                .memNo(loginDTO.getMemNo())
                .refreshToken(refreshToken)
                .build();
        try {
            if (loginDTO.getMemNo() == (authMapper.checkone(loginDTO.getMemNo())))
                authMapper.UpdateRefreshToken(insertOrUpdateRefreshToken);
        }
        // 토큰에 유저 넘버가 없는 신규 토큰 발급이면 exception 처리를 해서 토큰 insert
        catch (BindingException e) {
            authMapper.insertefreshToken(insertOrUpdateRefreshToken);
        }
        return result;
    }

    // 새로운 AccessToken 발급
    public Map<String, Object> newAccessToken(AuthDTO.GetNewAccessTokenDTO getNewAccessTokenDTO, HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();
        String accessToken = getNewAccessTokenDTO.getAccessToken();
        String refreshToken = getNewAccessTokenDTO.getRefreshToken();
        // AccessToken은 만료됐지만 정보가 일치하는지 확인
        if (validateJwtToken(request, accessToken, 3)) {
            // AccessToken은 만료되었지만 RefreshToken은 만료되지 않은 경우 , db에 refresh 토큰 검증
            if (validateJwtToken(request, refreshToken, 2)) {
                AuthDTO.LoginDTO loginDTO = new AuthDTO.LoginDTO();
                loginDTO.setMemMail(mail);
                loginDTO.setMemNo(authMapper.findNo(loginDTO.getMemMail()));
                // DB에 일치하는 토큰인지
                if (refreshToken.equals(authMapper.findByrefreshToken(loginDTO.getMemNo()))) {
                    String newToken = createAccessToken(loginDTO);
                    result.put("accessToken", newToken);
                } else
                    throw new RuntimeException("Refresh 토큰이 일치하지 않습니다 ");
            } else {
                // RefreshToken 또한 만료된 경우는 로그인을 다시 진행해야 한다.
                throw new RuntimeException("Refresh 토큰이 만료되었습니다 ");
//            result.put("code", ErrorCode.ReLogin.getCode());
//            result.put("message", ErrorCode.ReLogin.getMessage());
//            result.put("HttpStatus", ErrorCode.ReLogin.getStatus());
            }
        } else {
            throw new RuntimeException("Access 토큰이 일치 하지 않습니다 ");
        }
        return result;
    }

    // token validation 확인을 위한 메서드
    // 1이면 access 검증 , 2면 refresh 검증
    public boolean validateJwtToken(ServletRequest request, String token, int num) {

        try {
            if (num == 1 || num == 3)
                Jwts.parser().setSigningKey("${jwt.secretA}").parseClaimsJws(token);
            else
                Jwts.parser().setSigningKey("${jwt.secretB}").parseClaimsJws(token);
            return true;

        } catch (MalformedJwtException e) {

            request.setAttribute("exception", "MalformedJwtException");
        } catch (ExpiredJwtException e) {
            if (num == 3)
                return true;
            request.setAttribute("exception", "ExpiredJwtException");
        } catch (UnsupportedJwtException e) {

            request.setAttribute("exception", "UnsupportedJwtException");
        } catch (IllegalArgumentException e) {

            request.setAttribute("exception", "IllegalArgumentException");
        }
        return false;
    }


    // 필터 내에서 토큰이 사용될 때 유저의 메일을 이용해서 유저 디테일에 담는다
    public Authentication getAuthentication(String token) {
        UserDetails userDetails = customUserDetailService.loadUserByUsername(this.getUserInfo(token));
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());

    }

    // 토큰을 파싱해서 유저의 정보를 얻는다
    public String getUserInfo(String token) {
        return (String) Jwts.parser().setSigningKey("${jwt.secretA}").parseClaimsJws(token).getBody().get("memMail");
    }


}
