package com.flow.project.controller.apicontroller;

import com.flow.project.domain.Notifications;
import com.flow.project.service.NotificationsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class NotificationsApiController {

    private final NotificationsService notificationsService;

    // 글, 댓글, 초대 알림 추가
    @PostMapping("/notis/rooms/{rmNo}")
    public ResponseEntity<?> addNotification(@RequestBody Notifications bean) {
        try {
            if (notificationsService.addNotification(bean) > 0) {
                return ResponseEntity.ok(bean);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 글, 댓글, 초대 알림 수정
    @PutMapping("/notis/{ntNo}/member/{memNo}")
    public ResponseEntity<?> editNotification(@RequestBody Notifications bean) {
        try {
            if (notificationsService.editNotification(bean) > 0) {
                return ResponseEntity.ok(bean);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
