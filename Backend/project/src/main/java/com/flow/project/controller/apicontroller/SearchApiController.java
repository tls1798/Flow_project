package com.flow.project.controller.apicontroller;

import com.flow.project.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class SearchApiController {
    final SearchService searchService;

    @GetMapping("/search/{memNo}/{search}")
    public ResponseEntity<?> getInfo(@PathVariable String search, @PathVariable String memNo) {
        return ResponseEntity.status(HttpStatus.OK).body(searchService.getInfo(search, memNo));
    }
}
