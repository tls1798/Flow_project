package com.flow.project.controller.apicontroller;

import com.flow.project.domain.Posts;
import com.flow.project.service.NotificationsService;
import com.flow.project.service.PostsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PostsApiController {
    final PostsService postsService;
    final NotificationsService notificationsService;

    //  특정 프로젝트 방 특정 글 하나 가져오기
//    @GetMapping("/rooms/{rmNo}/posts/{postNo}")
//    public ResponseEntity<?> getPost(@PathVariable String rmNo, @PathVariable int postNo) {
//        return ResponseEntity.status(HttpStatus.OK).body(postsService.getPost(rmNo, postNo));
//    }

    //  특정 프로젝트 방 글 작성
    @PostMapping("/rooms/{rmNo}/posts")
    public ResponseEntity<?> addPost(@RequestBody Posts bean) {
        try {
            if (postsService.addPost(bean) > 0) {
                return ResponseEntity.ok(bean);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    //  특정 프로젝트 방 글 수정
    @PutMapping("/rooms/{rmNo}/posts/{postNo}")
    public ResponseEntity<?> editPost(@RequestBody Posts bean) {
        try {
            if (postsService.editPost(bean) > 0) {
                return ResponseEntity.ok(bean);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.badRequest().build();

    }

    //  특정 프로젝트 방 글 삭제
    @DeleteMapping("/rooms/{rmNo}/posts/{postNo}/{memNo}")
    public ResponseEntity<?> removePost(@PathVariable String rmNo, @PathVariable int postNo, @PathVariable int memNo) {
        // 글 삭제 시, 관련 알림도 삭제
        return notificationsService.removePostNoti(postNo)
                && postsService.removePost(rmNo, postNo, memNo) > 0
                ? ResponseEntity.ok().build()
                : ResponseEntity.badRequest().build();
    }

    // 특정 글 상단고정
    @PostMapping("/rooms/posts/{postNo}/pin/{postPin}")
    public ResponseEntity<?> editPin(@PathVariable int postNo,@PathVariable int postPin) {
        return ResponseEntity.ok(postsService.editPin(postNo,postPin));
    }
}
