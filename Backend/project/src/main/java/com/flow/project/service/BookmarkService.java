package com.flow.project.service;

import com.flow.project.domain.Bookmark;
import com.flow.project.repository.BookmarkMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    final BookmarkMapper bookMapper;

    // 북마크 리스트 불러오기
    public List<Bookmark.BookmarkDTO> selectAll(int memNo){
        return bookMapper.selectAll(memNo);
    }
    // 북마크 추가하기
    public int addBookmark(Bookmark bookmark){
        return bookMapper.insertOne(bookmark);
    }
    // 북마크 삭제하기
    public int deleteBookmark(Bookmark bookmark){
        return bookMapper.deleteOne(bookmark);
    }
}
