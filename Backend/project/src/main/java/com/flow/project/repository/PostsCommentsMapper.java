package com.flow.project.repository;

import com.flow.project.domain.Comments;
import com.flow.project.domain.Posts;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface PostsCommentsMapper {

    // 특정 프로젝트 방 글 전체 가져오기 (페이징)
    @Select("select p.post_no, p.rm_no, p.post_writer, p.post_title, p.post_content, p.post_pin,to_char(p.post_datetime, 'YYYY-MM-DD HH24:MI') post_datetime, m.mem_name as post_name, " +
            "(select count(*) from bookmark b where b.mem_no = #{memNo} and b.post_no = p.post_no) as post_bookmark, " +
            "(select r.rm_admin from \"Rooms\" r where r.rm_no = #{rmNo}) as rm_admin, " +
            "(select r.rm_title from \"Rooms\" r where r.rm_no = #{rmNo}) as rm_title, " +
            "(select count(*) from \"Notis\" n, jsonb_each_text(n.nt_check) where n.nt_type_no = 1 and n.post_no = p.post_no and n.nt_check -> key != 'null') as post_read_count " +
            "from \"Posts\" p " +
            "inner join \"Members\" m on p.post_writer = m.mem_no where rm_no = #{rmNo} order by post_no desc " +
            "offset #{pageNo} limit 10")
    List<Posts> selectAllPost(String memNo, String rmNo, int pageNo);

    // 특정 프로젝트 방 댓글 전체 가져오기
    @Select("select c.cm_no, c.post_no, c.cm_content, c.cm_writer, to_char(c.cm_datetime, 'YYYY-MM-DD HH24:MI') cm_datetime, m.mem_name as cm_name " +
            "from \"Comments\" c " +
            "inner join \"Members\" m ON c.cm_writer = m.mem_no " +
            "where post_no = #{postNo} order by cm_no desc")
    List<Comments> selectAllComments(int postNo);
}