package com.flow.project.service;

import com.flow.project.domain.Members;
import com.flow.project.repository.MembersMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MembersService {
    final
    MembersMapper mem;
    @Autowired
    private PasswordEncoder passwordEncoder;
    // 한명 찾기 테스트
    public Members getMember(int idx) {
        return mem.findOne(idx);
    }

    // 회원 전체 출력
    public List<Members> getMembers(){
        return mem.findAll();
    }
    // 회원 가입
    public int addMember(Members members) {
        String encodedPassword = passwordEncoder.encode(members.getPassword());
        members.setPassword(encodedPassword);
        return mem.insertOne(members);
    }

}
