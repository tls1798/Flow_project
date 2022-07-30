package com.flow.project.controller.apicontroller;

import com.flow.project.service.PostsCommentsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class PostsCommentsApiController {

    final PostsCommentsService postsCommentsService;

    // 특정 프로젝트 방 글 전체, 댓글 전체 가져오기
    @GetMapping("members/{memNo}/rooms/{rmNo}/posts")
    public ResponseEntity<?> getPosts(@PathVariable int memNo, @PathVariable String rmNo) {
        return ResponseEntity.status(HttpStatus.OK).body(postsCommentsService.getPosts(memNo, rmNo));
    }

    // 특정 프로젝트 특정 글, 댓글 전체 가져오기
    @GetMapping("/members/{memNo}/rooms/{rmNo}/posts/{postNo}")
    public ResponseEntity<?> getPost(@PathVariable int memNo, @PathVariable String rmNo, @PathVariable int postNo){
        return ResponseEntity.status(HttpStatus.OK).body(postsCommentsService.getPost(memNo, rmNo, postNo));
    }
}
