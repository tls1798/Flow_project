package com.flow.project.controller.apicontroller;

import com.flow.project.domain.Rooms;
import com.flow.project.service.RoomsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RoomsApiController {

    final RoomsService roomsService;

    // 프로젝트 생성
    @PostMapping("/rooms")
    public ResponseEntity<?> addRoom(@RequestBody Rooms room){
        if(roomsService.addRoom(room))
            return ResponseEntity.ok(room);
        return ResponseEntity.badRequest().build();
    }

    // 프로젝트 수정
    @PutMapping("/rooms/{rmNo}")
    public ResponseEntity<?> editRoom(@RequestBody Rooms room){
        return ResponseEntity.ok(roomsService.editRoom(room));
    }

    // 프로젝트 삭제
    @DeleteMapping("/rooms/{rmNo}")
    public ResponseEntity<?> removeRoom(@PathVariable int rmNo){
        return ResponseEntity.ok(roomsService.removeRoom(rmNo));
    }
}
