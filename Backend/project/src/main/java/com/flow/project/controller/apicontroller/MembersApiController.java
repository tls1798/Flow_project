package com.flow.project.controller.apicontroller;

import com.flow.project.service.MembersService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MembersApiController {

    final MembersService ms;

    // 한 명 정보 (프로필 상세 팝업)
    @GetMapping("/member/{idx}")
    public ResponseEntity<?> getMember(@PathVariable int idx) {
        return ResponseEntity.status(HttpStatus.OK).body(ms.getMember(idx));
    }

    // 전체 출력 (초대 팝업의 회원 목록)
    @GetMapping("/members")
    public ResponseEntity<?> getMembers() {
        return ResponseEntity.status(HttpStatus.OK).body(ms.getMembers());
    }

    // 회원 탈퇴
    @DeleteMapping("/members/exit/{memNo}")
    public ResponseEntity<?> removeMember(@PathVariable int memNo) {
        return ResponseEntity.ok(ms.removeMember(memNo));
    }
}
