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

    @GetMapping("/rooms/{rmNo}/posts")
    public ResponseEntity<?> getPosts(@PathVariable String rmNo) {
        return ResponseEntity.status(HttpStatus.OK).body(postsCommentsService.getPosts(rmNo));
    }
}
