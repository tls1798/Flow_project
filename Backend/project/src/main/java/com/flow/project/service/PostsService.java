package com.flow.project.service;

import com.flow.project.domain.Posts;
import com.flow.project.repository.PostsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostsService {
    final PostsMapper postsMapper;

    // 특정 프로젝트 방 글 작성
    public int addPost(Posts bean) {
        return postsMapper.insertOne(bean);
    }

    // 특정 프로젝트 방 글 수정
    public int editPost(Posts bean) {
        return postsMapper.updateOne(bean);
    }

    // 특정 프로젝트 방 글 삭제
    public int removePost(String rmNo, int postNo, String memNo) {
        return postsMapper.deleteOne(rmNo, postNo, memNo);
    }

    // 특정 글 상단고정
    public int editPin(int postNo, int postPin) {
        return postsMapper.updatePin(postNo, postPin);
    }

    // 상단고정 글 가져오기
    public List<Posts> getPostsPin(String rmNo) {
        return postsMapper.selectPostsPin(rmNo);
    }

    // 특정 프로젝트 방 전체 글 개수
    public int getPostsCount(String rmNo) {
        return postsMapper.selectPostsCount(rmNo);
    }
}
