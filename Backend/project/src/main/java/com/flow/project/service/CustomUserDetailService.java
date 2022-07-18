package com.flow.project.service;


import com.flow.project.domain.Members;
import com.flow.project.handler.ErrorCode;
import com.flow.project.handler.UserException;
import com.flow.project.repository.AuthMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

    private final AuthMapper authMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Members user = authMapper.findByEmail(username);
        if(user == null){
            throw new UserException(ErrorCode.UsernameOrPasswordNotFoundException);
        }
        return user;

    }
}
