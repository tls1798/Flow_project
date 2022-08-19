package com.flow.project.controller.apicontroller;

import com.flow.project.domain.Comments;
import com.flow.project.service.CommentsService;
import com.flow.project.service.NotificationsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentsApiController {

    final CommentsService commentsService;
    final NotificationsService notificationsService;

    // 특정 게시 글 전체 댓글 가져오기
    @GetMapping("/posts/{postNo}/comments")
    public ResponseEntity<?> getComments(@PathVariable int postNo) {
        return ResponseEntity.status(HttpStatus.OK).body(commentsService.getComments(postNo));
    }

    // 특정 게시 글 특정 댓글 가져오기
    @GetMapping("/posts/{postNo}/comments/{cmNo}")
    public ResponseEntity<?> getComment(@PathVariable int postNo, @PathVariable int cmNo) {
        return ResponseEntity.status(HttpStatus.OK).body(commentsService.getComment(postNo, cmNo));
    }

    // 특정 게시 글 댓글 작성
    @PostMapping("/posts/{postNo}/comments")
    public ResponseEntity<?> addComment(@RequestBody Comments bean) {
        try {
            if (commentsService.addComment(bean) > 0) {
                return ResponseEntity.ok(bean);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 특정 게시 글 댓글 수정
    @PutMapping("/posts/{postNo}/comments/{cmNo}")
    public ResponseEntity<?> editComment(@RequestBody Comments bean) {
        try {
            if (commentsService.editComment(bean) > 0) {
                return ResponseEntity.ok(bean);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.badRequest().build();
    }

    // 특정 게시 글 댓글 삭제
    @DeleteMapping("/posts/{postNo}/comments/{cmNo}/{memNo}")
    public ResponseEntity<?> removeComment(@PathVariable int postNo, @PathVariable int cmNo, @PathVariable String memNo) {
        // 관련 알림 없을 때
        if(notificationsService.getRoomNotisByPostNo(memNo, postNo) == 0){
            return commentsService.removeComment(postNo, cmNo, memNo) > 0 ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
        }
        // 관련 알림 있을 때 댓글 삭제 시, 관련 알림도 삭제
        else {
            return commentsService.removeComment(postNo, cmNo, memNo) > 0
                    && notificationsService.removeCommentNoti(cmNo)
                    ? ResponseEntity.ok().build()
                    : ResponseEntity.badRequest().build();
        }
    }
}
