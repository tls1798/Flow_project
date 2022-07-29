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
public class SearchController {
    final SearchService searchService;

    @GetMapping("/search/{search}")
    public ResponseEntity<?> getInfo(@PathVariable String search) {
        return ResponseEntity.status(HttpStatus.OK).body(searchService.getInfo(search));
    }
}
