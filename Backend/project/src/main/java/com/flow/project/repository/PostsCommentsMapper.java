package com.flow.project.repository;

import com.flow.project.domain.Comments;
import com.flow.project.domain.Posts;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface PostsCommentsMapper {
    
    // 프로젝트 방 글 가져오기
    @Select("select p.post_no, p.rm_no, p.post_writer, p.post_title, p.post_content, p.post_pin,to_char(p.post_datetime, 'YYYY-MM-DD HH24:MI') post_datetime, m.mem_name as post_name from \"Posts\" p inner join \"Members\" m on p.post_writer = m.mem_no where rm_no=#{rmNo} order by post_no desc")
    List<Posts> selectAllPost(String rmNo);

    // 프로젝트 방 댓글 가져오기
    @Select("select c.cm_no, c.post_no, c.cm_content, c.cm_writer, to_char(c.cm_datetime, 'YYYY-MM-DD HH24:MI') cm_datetime, m.mem_name as cm_name from \"Comments\" c inner join \"Members\" m ON c.cm_writer = m.mem_no  where post_no=#{postNo} order by cm_no DESC")
    List<Comments> selectAllComments(int postNo);

}