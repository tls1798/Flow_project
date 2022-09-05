package com.flow.project.config;

import com.google.common.base.Charsets;
import com.google.common.hash.Hashing;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


import java.util.HashMap;
import java.util.Map;

// com.google.common.hash.HashFunction 사용
// hash256 암호화 및 복호화

@Configuration
public class PasswordSecurityBean {


    @Bean
    public static PasswordEncoder passwordEncoder() {

        // encoding 기본형
        String idForEncode = "sha256";

        Map<String, PasswordEncoder> encoders = new HashMap<>();

        encoders.put("sha256", new PasswordEncoder() {
            @Override
            public String encode(CharSequence rawPassword) {
                String encrypted = Hashing.sha256().hashString(rawPassword.toString(), Charsets.UTF_8).toString();
                return encrypted;
            }

            @Override
            public boolean matches(CharSequence rawPassword, String encodedPassword) {
                return encode(rawPassword).equals(encodedPassword);
            }
        });
        return new DelegatingPasswordEncoder(idForEncode, encoders);
    }

}