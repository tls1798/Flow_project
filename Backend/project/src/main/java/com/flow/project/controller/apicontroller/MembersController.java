package com.flow.project.controller.apicontroller;

import com.flow.project.domain.Members;
import com.flow.project.service.MembersService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class MembersController {

    final MembersService ms;

    // 한 명 정보
    @GetMapping("/member/{idx}")
    public ResponseEntity<?> getMember(@PathVariable int idx){
        return ResponseEntity.status(HttpStatus.OK).body(ms.getMember(idx));
    }
//     전체 출력
    @GetMapping("/members")
    public ResponseEntity<?> getMembers(){
        return ResponseEntity.status(HttpStatus.OK).body(ms.getMembers());
    }
}
