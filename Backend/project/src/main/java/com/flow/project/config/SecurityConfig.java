package com.flow.project.config;

import com.flow.project.handler.AuthenticationEntryPointHandler;
import com.flow.project.jwt.JwtAuthenticationFilter;
import com.flow.project.jwt.JwtProvider;
import com.flow.project.service.CustomUserDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// WebSecurityConfigurerAdapter 상속받은 클래스에
// EnableWebSecurity 어노테이션을 붙이면 Web 보안 활성화
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final JwtProvider jwtProvider;
    private final AuthenticationEntryPointHandler authenticationEntryPointHandler;
    private final CustomUserDetailService customUserDetailService;
    private final PasswordEncoder passwordEncoder;

    // AuthenticationManagerBuilder의 passwordEncoder()를 통해
    // 패스워드 암호화에 사용될 PasswordEncoder 구현체를 지정할 수 있다
    @Override
    protected void configure(AuthenticationManagerBuilder builder) throws Exception {
        builder.userDetailsService(customUserDetailService).passwordEncoder(passwordEncoder);
    }
    // Spring Boot 2.x 부터는 자동으로 등록되지 않기 때문에 등록을 해주어야한다
    // Authentication 객체 생성
    @Bean(name = BeanIds.AUTHENTICATION_MANAGER)
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
    protected void configure(HttpSecurity http) throws Exception {
        http
                .httpBasic().disable()
                // rest Api는 csrf 보안이 필요없으므로 disable 처리
                .csrf().disable()
                // Jwt Token으로 인증하므로 Stateless 처리
               .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers("/api/auth/*", "/api/auth/members/new", "/api/auth/email/*").permitAll()
                .anyRequest().authenticated()
                .and()
                // 인증 처리 과정에서 예외가 발생한 경우 예외를 핸들링하는 인터페이스
                .exceptionHandling()
                .authenticationEntryPoint(authenticationEntryPointHandler)
                .and()
                // JWT 필터를 UsernamePasswordAuthenticationFilter 전에 넣는다
                .addFilterBefore(new JwtAuthenticationFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class);
    }
}
