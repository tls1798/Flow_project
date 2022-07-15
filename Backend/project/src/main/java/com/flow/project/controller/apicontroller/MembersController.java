package com.flow.project.controller.apicontroller;

import com.flow.project.domain.AuthDTO;
import com.flow.project.service.MembersService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MembersController {

    final MembersService ms;

    // 한 명 정보
    @GetMapping("/member/{idx}")
    public ResponseEntity<?> getMember(@PathVariable int idx) {
        return ResponseEntity.status(HttpStatus.OK).body(ms.getMember(idx));
    }

    //     전체 출력
    @GetMapping("/members")
    public ResponseEntity<?> getMembers() {
        return ResponseEntity.status(HttpStatus.OK).body(ms.getMembers());
    }

    // 로그아웃하면서 토큰 삭제
    @DeleteMapping("/members/{idx}")
    public ResponseEntity<?> removePost(@PathVariable int memNo) {
        return ms.deleteMem(memNo) > 0 ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }
}
