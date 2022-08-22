package com.flow.project.service;

import com.flow.project.domain.AuthDTO;
import com.flow.project.domain.Members;
import com.flow.project.handler.ErrorCode;
import com.flow.project.handler.UserException;
import com.flow.project.repository.AuthMapper;
import com.flow.project.repository.MembersMapper;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.binding.BindingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MembersService {

    final AuthMapper authMapper;
    final MembersMapper mem;
    private final PasswordEncoder passwordEncoder;

    // Validation error
    public ResponseEntity<?> validateHandling(Errors errors) {
        Map<String, String> result = new HashMap<>();
        for (FieldError error : errors.getFieldErrors()) {
            String validKeyName = String.format("valid_%s", error.getField());
            result.put(validKeyName, error.getDefaultMessage());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    // 한명 찾기 테스트
    public Members getMember(String idx) {
        return mem.selectOne(idx);
    }

    // 회원 전체 출력
    public List<Members> getMembers() {
        return mem.selectAll();
    }

    // 회원 가입
    public int addMember(AuthDTO.SignupDTO signupDTO) {
        // UUID 생성
        signupDTO.setMemNo(UUID.randomUUID().toString());
        // 기존에 있는 유저인지 확인
        if (signupDTO.getMemMail().equals(mem.findmailByEmail(signupDTO.getMemMail())))
            throw new UserException(ErrorCode.UserExistsException);
        // 패스워드를 Encode해서 저장
        String encodedPassword = passwordEncoder.encode(signupDTO.getMemPw());

        signupDTO.setMemPw(encodedPassword);
        return mem.insertOne(signupDTO);
    }

    // 로그아웃시 토큰 삭제
    public int deleteMem(String memNo) {
        return mem.deleteOne(memNo);
    }

    // 회원 탈퇴
    public boolean removeMember(String memNo) {
        return mem.deleteMem(memNo);
    }

    // 아이디 존재하는지 확인
    public String checkId(String memMail) {
        try{
           return authMapper.findNo(memMail);
        }catch (BindingException e){
           return "";
        }
   }
}
