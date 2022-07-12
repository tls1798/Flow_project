package com.flow.project.service;

import com.flow.project.domain.AuthDTO;
import com.flow.project.domain.RefreshToken;
import com.flow.project.handler.ErrorCode;
import com.flow.project.jwt.ApiResponse;
import com.flow.project.jwt.JwtProvider;
import com.flow.project.jwt.ResponseMap;
import com.flow.project.repository.AuthMapper;
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
    private final AuthMapper authMapper;
    long a= 20;

    public ApiResponse login(AuthDTO.LoginDTO loginDTO) {
        ResponseMap result = new ResponseMap();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword())
            );

            Map createToken = createTokenReturn(loginDTO);
            result.setResponseData("accessToken", createToken.get("accessToken"));
            System.out.println(createToken.get("accessToken"));
            result.setResponseData("refreshIdx", createToken.get("refreshIdx"));
        } catch (Exception e) {
            e.printStackTrace();

            System.out.println("erroffr");
//            throw new AuthenticationException(ErrorCode.UsernameOrPasswordNotFoundException);
        }

        return result;
    }

    public ApiResponse newAccessToken(AuthDTO.GetNewAccessTokenDTO getNewAccessTokenDTO, HttpServletRequest request){
        ResponseMap result = new ResponseMap();
        String refreshToken = authMapper.findRefreshTokenByIdx(getNewAccessTokenDTO.getRefreshIdx());

        // AccessToken은 만료되었지만 RefreshToken은 만료되지 않은 경우
        if(jwtProvider.validateJwtToken(request, refreshToken)){
            String email = jwtProvider.getUserInfo(refreshToken);
            AuthDTO.LoginDTO loginDTO = new AuthDTO.LoginDTO();
            loginDTO.setEmail(email);

            Map createToken = createTokenReturn(loginDTO);
            result.setResponseData("accessToken", createToken.get("accessToken"));

            result.setResponseData("refreshIdx", createToken.get("refreshIdx"));
        }else{
            // RefreshToken 또한 만료된 경우는 로그인을 다시 진행해야 한다.
            result.setResponseData("code", ErrorCode.ReLogin.getCode());
            result.setResponseData("message", ErrorCode.ReLogin.getMessage());
            result.setResponseData("HttpStatus", ErrorCode.ReLogin.getStatus());
        }
        return result;
    }

    // 토큰을 생성해서 반환
    private Map<String, String> createTokenReturn(AuthDTO.LoginDTO loginDTO) {
        Map result = new HashMap();

        String accessToken = jwtProvider.createAccessToken(loginDTO);
        String refreshToken = jwtProvider.createRefreshToken(loginDTO).get("refreshToken");
        String refreshTokenExpirationAt = jwtProvider.createRefreshToken(loginDTO).get("refreshTokenExpirationAt");

        RefreshToken insertRefreshToken = RefreshToken.builder()
                .userEmail(loginDTO.getEmail())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .refreshTokenExpirationAt(refreshTokenExpirationAt)
                .build();

        authMapper.insertOrUpdateRefreshToken(insertRefreshToken);

        result.put("accessToken", accessToken);


        a++;

        result.put("refreshIdx", a);
        return result;
    }
}

