package com.flow.project.controller.apicontroller;

import com.flow.project.domain.AuthDTO;
import com.flow.project.domain.Members;
import com.flow.project.jwt.ApiResponse;
import com.flow.project.service.AuthService;
import com.flow.project.service.MembersService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

@Api(tags = "Auth / 로그인")
@RequestMapping("/api/auth")
@RestController
@RequiredArgsConstructor
public class AuthController {

    final MembersService membersService;
    private final AuthService authService;

//    로그인
    @PostMapping("/members")
    @ApiOperation(value="로그인")
    public ApiResponse login(@RequestBody @Valid AuthDTO.LoginDTO loginDTO){
        return authService.login(loginDTO);
    }

// 회원가입
    @PostMapping("/members/new")
    public ResponseEntity<?> addMember(@RequestBody Members members) {
        if(membersService.addMember(members)>0) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

//    새로운 토큰 발급
    @PostMapping("/get-newToken")
    public ApiResponse newAccessToken(@RequestBody @Valid AuthDTO.GetNewAccessTokenDTO getNewAccessTokenDTO, HttpServletRequest request) {
        return authService.newAccessToken(getNewAccessTokenDTO, request);
    }

}
