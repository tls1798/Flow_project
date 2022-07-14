package com.flow.project.service;

import com.flow.project.domain.Members;
import com.flow.project.jwt.JwtProvider;
import com.flow.project.repository.MembersMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class MembersService {
    final
    MembersMapper mem;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;

    // 한명 찾기 테스트
    public Members getMember(int idx) {
        return mem.selectOne(idx);
    }

    // 회원 전체 출력
    public List<Members> getMembers() {
        return mem.selectAll();
    }

    // 회원 가입
    public int addMember(Members members) {

        if (members.getMemMail().equals(mem.findmailByEmail(members.getMemMail())))
            throw new RuntimeException("이미 가입되어 있는 유저입니다");

        String encodedPassword = passwordEncoder.encode(members.getMemPw());
        System.out.println(encodedPassword);

        members.setMemPw(encodedPassword);
        return mem.insertOne(members);
    }

    // 로그아웃시 토큰 삭제
    public int deleteMem(int memNo) {
        return mem.deleteOne(memNo);
    }

}
