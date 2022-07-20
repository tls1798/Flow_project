package com.flow.project.controller.apicontroller;

import com.flow.project.domain.RoomMembers;
import com.flow.project.service.RoomMembersService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RoomMembersApiController {

    final RoomMembersService roomMembersService;

    // 멤버 별 프로젝트 리스트
    @GetMapping("/members/{memNo}/rooms")
    public ResponseEntity<?> getRooms(@PathVariable int memNo) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(roomMembersService.getRooms(memNo));
    }

    // 프로젝트 별 참여자 리스트
    @GetMapping("/rooms/{rmNo}/members")
    public ResponseEntity<?> getMembers(@PathVariable String rmNo) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(roomMembersService.getMembers(rmNo));
    }

    // 참여자 가져오기
    @GetMapping("/rooms/{rmNo}/members/{memNo}")
    public ResponseEntity<?> getParticipants(@PathVariable String rmNo, @PathVariable int memNo) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(roomMembersService.getParticipants(rmNo, memNo));
    }

    // 프로젝트에 멤버 초대
    @PostMapping("/room-members")
    public ResponseEntity<?> addMember(@RequestBody List<RoomMembers> roomMembers) {
        if (roomMembersService.addMember(roomMembers))
            return ResponseEntity.ok(roomMembers);
        return ResponseEntity.badRequest().build();
    }

    // 프로젝트 나가기
    @DeleteMapping("/room-members/{memNo}")
    public ResponseEntity<?> removeMember(@RequestBody RoomMembers roomMember) {
        return ResponseEntity.ok(roomMembersService.removeMember(roomMember));
    }
}
