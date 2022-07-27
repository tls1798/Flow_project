package com.flow.project.controller.apicontroller;

import com.flow.project.domain.AuthDTO;
import com.flow.project.service.AuthService;
import com.flow.project.service.EmailService;
import com.flow.project.service.MembersService;
import io.swagger.annotations.Api;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;



@RequestMapping("/api/auth")
@RestController
@RequiredArgsConstructor
public class AuthController {
    final EmailService emailService;
    final MembersService membersService;
    private final AuthService authService;

    // 로그인
    @PostMapping("/members")
    public ResponseEntity<?> login(@RequestBody @Valid AuthDTO.LoginDTO loginDTO, Errors errors) {
        if (errors.hasErrors())
            return membersService.validateHandling(errors);

        return ResponseEntity.status(HttpStatus.OK).body(authService.login(loginDTO));
    }

    // 회원가입
    @PostMapping("/members/new")
    public ResponseEntity<?> addMember(@RequestBody @Valid AuthDTO.SignupDTO signupDTO, Errors errors) {
        if (errors.hasErrors())
            return membersService.validateHandling(errors);
        return ResponseEntity.status(HttpStatus.OK).body(membersService.addMember(signupDTO));
    }

    // 이메일 인증
    @PostMapping("/email")
    public ResponseEntity<?> chkMail(@RequestBody @Valid AuthDTO.EmailDTO emailDTO, Errors errors) throws Exception {
        if (errors.hasErrors())
            return membersService.validateHandling(errors);
        return ResponseEntity.status(HttpStatus.OK).body(emailService.sendSimpleMessage(emailDTO.getMemMail(), 1));
    }

    // 패스워드재발급
    @PostMapping("/email/new")
    public ResponseEntity<?> emailpw(@RequestBody @Valid AuthDTO.EmailDTO emailDTO, Errors errors) throws Exception {
        if (errors.hasErrors())
            return membersService.validateHandling(errors);
        return ResponseEntity.status(HttpStatus.OK).body(emailService.sendSimpleMessage(emailDTO.getMemMail(), 2));
    }

    // 새로운 토큰 발급
    @PostMapping("/get-newToken")
    public ResponseEntity<?> newAccessToken(@RequestBody AuthDTO.GetNewAccessTokenDTO getNewAccessTokenDTO, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.OK).body(authService.reissue(getNewAccessTokenDTO, request));

    }

    // 로그아웃하면서 토큰 삭제
    @DeleteMapping("/members/{memNo}")
    public ResponseEntity<?> removePost(@PathVariable int memNo) {
        return membersService.deleteMem(memNo) > 0 ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    // 회원 탈퇴
    @DeleteMapping("/members/temp/{memNo}")
    public ResponseEntity<?> removeMember(@PathVariable int memNo) {
        return ResponseEntity.ok(membersService.removeMember(memNo));
    }
}
