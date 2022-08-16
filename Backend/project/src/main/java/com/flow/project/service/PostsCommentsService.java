package com.flow.project.service;

import com.flow.project.domain.Comments;
import com.flow.project.domain.Posts;
import com.flow.project.domain.PostsComments;
import com.flow.project.repository.CommentsMapper;
import com.flow.project.repository.PostsCommentsMapper;
import com.flow.project.repository.PostsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostsCommentsService {

    private final PostsCommentsMapper postsCommentsMapper;
    private final PostsMapper postsMapper;
    private final CommentsMapper commentsMapper;

    // 특정 프로젝트룸 글 전체, 댓글 전체 가져오기
    public List<PostsComments> getPosts(int memNo, String rmNo, int pageNo) {
        // 글 전체 댓글 전체 담는 리스트
        List<PostsComments> postsComments = new ArrayList<>();

        // 글 하나 댓글 여러개 담는 객체
        PostsComments postComments;

        // 글 리스트
        List<Posts> posts = postsCommentsMapper.selectAllPost(memNo, rmNo, pageNo);
        for (Posts post : posts) {
            postComments = new PostsComments();

            // 댓글 리스트
            List<Comments> comments = postsCommentsMapper.selectAllComments(post.getPostNo());
            postComments.setPosts(post);
            if (comments != null) {
                postComments.setCommentsList(comments);
            }
            postsComments.add(postComments);
        }
        return postsComments;
    }

    // 특정 프로젝트 특정 글, 댓글 전체 가져오기
    public PostsComments getPost(int memNo, String rmNo, int postNo){
        // 글 하나 댓글 여러개 담는 객체
        PostsComments postComments = new PostsComments();

        // 글 하나
        Posts post = postsMapper.selectOne(memNo, rmNo, postNo);
        postComments.setPosts(post);

        // 댓글 리스트
        List<Comments> comments = commentsMapper.selectAll(postNo);
        if(comments!=null){
            postComments.setCommentsList(comments);
        }
        return postComments;
    }
}
