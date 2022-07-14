package com.flow.project.service;

import com.flow.project.domain.Comments;
import com.flow.project.domain.Posts;
import com.flow.project.domain.PostsComments;
import com.flow.project.repository.PostsCommentsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostsCommentsService {

    private final PostsCommentsMapper postsCommentsMapper;

    public List<PostsComments> getPosts(int rmNo) {

//      글 전체 댓글 전체
        List<PostsComments> postsComments = new ArrayList<>();

//      글 하나 댓글 여러개
        PostsComments postComments;

//      글 리스트
        List<Posts> posts = postsCommentsMapper.selectAllPost(rmNo);
        for (Posts post : posts) {
            postComments = new PostsComments();

//          댓글 리스트
            List<Comments> comments = postsCommentsMapper.selectAllComments(post.getPostNo());
            postComments.setPosts(post);
            if (comments != null) {
                postComments.setCommentsList(comments);
            }
            postsComments.add(postComments);
        }
        return postsComments;
    }

}
