package com.flow.project.jwt;


import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

// DoFilter() 메서드는  토큰이 유효하다면 SecurityContext 에 인증정보를 저장한다
// Filter  -> JwtProvider 토큰을 넘긴다
// JwtProvider --> UserDetailsService 에서 실제 DB에 정보를 가져온다
// UsernamePasswordAuthenticationToken 형식의 인증된 객체를 가져온다
// SecurityContext 에 Authentication 객체를 저장한다
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends GenericFilterBean {

    private final JwtProvider jwtProvider;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        // 헤더에서 JWT 를 받아온다
        String token = resolveToken((HttpServletRequest) request);

        // 유효한 토큰인지 확인한다
        if (token != null && jwtProvider.validateJwtToken(request, token,1)) {
            // 토큰이 유효하면 토큰으로부터 유저 정보를 받아온다
            Authentication authentication = jwtProvider.getAuthentication(token);
            // SecurityContext 에 Authentication 객체를 저장한다
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request, response);

    }

    public String resolveToken(HttpServletRequest request) {
        return request.getHeader("token");
    }
}
