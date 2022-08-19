package com.flow.project.controller.apicontroller;

import com.flow.project.domain.Bookmark;
import com.flow.project.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class BookmarkApiController {

    final BookmarkService bs;

    // 북마크 전체 출력
    @GetMapping("/bookmark/{memNo}")
    public ResponseEntity<?> getBookmarks(@PathVariable String memNo) {
        return ResponseEntity.status(HttpStatus.OK).body(bs.selectAll(memNo));
    }
    // 북마크 추가
    @PostMapping("/bookmark")
    public ResponseEntity<?> editBookmarks(@RequestBody Bookmark bookmark) {
        return ResponseEntity.status(HttpStatus.OK).body(bs.addBookmark(bookmark));
    }
    // 북마크 삭제
    @DeleteMapping("/bookmark")
    public ResponseEntity<?> removeBookmarks(@RequestBody Bookmark bookmark) {
        return ResponseEntity.status(HttpStatus.OK).body(bs.deleteBookmark(bookmark));
    }
}
