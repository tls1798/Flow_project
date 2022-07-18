package com.flow.project.service;

import com.flow.project.domain.AuthDTO;
import com.flow.project.domain.Members;
import com.flow.project.handler.ErrorCode;
import com.flow.project.handler.CustomException;
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
    public int addMember(AuthDTO.LoginDTO loginDTO) {

        if (loginDTO.getMemMail().equals(mem.findmailByEmail(loginDTO.getMemMail())))
            throw new CustomException(ErrorCode.UserExistsException);

        String encodedPassword = passwordEncoder.encode(loginDTO.getMemPw());
        System.out.println(encodedPassword);

        loginDTO.setMemPw(encodedPassword);
        return mem.insertOne(loginDTO);
    }

    // 로그아웃시 토큰 삭제
    public int deleteMem(int memNo) {
        return mem.deleteOne(memNo);
    }

}
