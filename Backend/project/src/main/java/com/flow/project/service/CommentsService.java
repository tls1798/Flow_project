package com.flow.project.service;

import com.flow.project.domain.Comments;
import com.flow.project.repository.CommentsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentsService {

    final CommentsMapper commentsMapper;

    // 특정 게시 글 전체 댓글 가져오기
    public List<Comments> getComments(int postNo) {
        return commentsMapper.selectAll(postNo);
    }

    // 특정 게시 글 특정 댓글 가져오기
    public Comments getComment(int postNo, int cmNo) {
        return commentsMapper.selectOne(postNo, cmNo);
    }

    // 특정 게시 글 댓글 작성
    public int addComment(Comments bean) {
        return commentsMapper.insertOne(bean);
    }

    // 특정 게시 글 댓글 수정
    public int editComment(Comments bean) {
        return commentsMapper.updateOne(bean);
    }

    // 특정 게시 글 댓글 삭제
    public int removeComment(int postNo, int cmNo, int memNo) {
        return commentsMapper.deleteOne(postNo, cmNo, memNo);
    }
}
