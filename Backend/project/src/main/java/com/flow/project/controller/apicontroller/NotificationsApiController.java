package com.flow.project.controller.apicontroller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.flow.project.service.NotificationsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class NotificationsApiController {

    private final NotificationsService notificationsService;

    // 내가 속한 프로젝트 룸 전체 알림 가져오기
    @GetMapping("/notis/member/{memNo}")
    public ResponseEntity<?> getNotifications(@PathVariable int memNo) throws JsonProcessingException {
        return ResponseEntity.status(HttpStatus.OK).body(notificationsService.getNotifications(memNo));
    }
}
