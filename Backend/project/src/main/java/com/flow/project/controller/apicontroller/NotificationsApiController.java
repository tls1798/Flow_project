package com.flow.project.controller.apicontroller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.flow.project.domain.Notifications;
import com.flow.project.service.NotificationsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class NotificationsApiController {

    private final NotificationsService notificationsService;

    // 내가 속한 프로젝트 룸 알림 모두 가져오기 (알림레이어)
    @GetMapping("/notis/member/{memNo}")
    public ResponseEntity<?> getNotifications(@PathVariable int memNo) throws JsonProcessingException {
        return ResponseEntity.status(HttpStatus.OK).body(notificationsService.getNotifications(memNo));
    }

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

    // 알림 모두 읽음 (알림레이어)
    @PutMapping("/notis/member/{memNo}")
    public ResponseEntity<?> editNotifications(@PathVariable int memNo) {
        try {
            if (notificationsService.editAllNotifications(memNo) > 0) {
                return ResponseEntity.ok(memNo);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 프로젝트 별 알림 모두 읽음 (피드 미확인)
    @PutMapping("/notis/member/{memNo}/rooms/{rmNo}")
    public ResponseEntity<?> editNotifications(@PathVariable int memNo, @PathVariable String rmNo) {
        try {
            if (notificationsService.editNotifications(memNo, rmNo) > 0) {
                return ResponseEntity.ok(memNo);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 프로젝트 방 나갈 시 알림 json 컬럼에서 내 번호 없애기
    @PutMapping("/notis/members/{memNo}/rooms/{rmNo}")
    public ResponseEntity<?> deleteRoomNotis(@PathVariable int memNo, @PathVariable String rmNo){
        try {
            if(notificationsService.deleteRoomNotis(memNo, rmNo) > 0){
                return ResponseEntity.ok(memNo);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
        } catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
}