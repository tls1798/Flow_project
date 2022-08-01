package com.flow.project.controller.apicontroller;

import com.flow.project.domain.Rooms;
import com.flow.project.service.NotificationsService;
import com.flow.project.service.RoomsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RoomsApiController {

    final RoomsService roomsService;
    final NotificationsService notificationsService;

    // 프로젝트 조회 (프로젝트 리스트에서 프로젝트 선택)
    @GetMapping("/rooms/{rmNo}")
    public ResponseEntity<?> getRoom(@PathVariable String rmNo) {
        return ResponseEntity.status(HttpStatus.OK).body(roomsService.getRoom(rmNo));
    }

    // 프로젝트 생성
    @PostMapping("/rooms")
    public ResponseEntity<?> addRoom(@RequestBody Rooms room) {
        if (roomsService.addRoom(room))
            return ResponseEntity.ok(room);
        return ResponseEntity.badRequest().build();
    }

    // 프로젝트 수정
    @PutMapping("/rooms/{rmNo}")
    public ResponseEntity<?> editRoom(@RequestBody Rooms room) {
        return ResponseEntity.ok(roomsService.editRoom(room));
    }

    // 프로젝트 삭제
    @DeleteMapping("/rooms/{rmNo}")
    public ResponseEntity<?> removeRoom(@PathVariable String rmNo) {

        Rooms room = roomsService.removeRoom(rmNo);
        // 프로젝트 삭제 시, 관련 알림도 삭제
        return room!=null && notificationsService.removeRoomNoti(rmNo)
                ? ResponseEntity.ok(room)
                : ResponseEntity.badRequest().build();
    }
}
