package com.flow.project.domain;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

// UserDetails 객체를 통한 정보를 관리하기 때문에 UserDetails 구현해서 리턴
@Getter
@Setter
public class Members implements UserDetails {

    private String memNo;
    private String memName;
    private String memMail;
    private String memPw;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collection = new ArrayList<>();
        collection.add(new SimpleGrantedAuthority("ROLE_USER"));
        return collection;
    }

    @Override
    public String getPassword() {

        return memPw;
    }

    @Override
    public String getUsername() {
        return memMail;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
