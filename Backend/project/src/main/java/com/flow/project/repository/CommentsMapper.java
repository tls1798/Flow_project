package com.flow.project.repository;

import com.flow.project.domain.Comments;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CommentsMapper {

    //  특정 게시 글 전체 댓글 가져오기
//    @Select("select * from \"Comments\" where post_no=#{postNo}")
//    List<Comments> selectAll(int postNo);
    @Select("select c.cm_no, c.post_no, c.cm_content, c.cm_writer, to_char(c.cm_datetime, 'YYYY-MM-DD HH24:MI') cm_datetime, to_char(c.cm_edit_datetime, 'YYYY-MM-DD HH24:MI') cm_edit_datetime, " +
            "(select m.mem_name from \"Members\" m where c.cm_writer = m.mem_no) as cm_name " +
            "from \"Comments\" c " +
            "where post_no = #{postNo}")
    List<Comments> selectAll(int postNo);

    //  특정 게시 글 특정 댓글 가져오기
    @Select("select * from \"Comments\" where post_no=#{postNo} and cm_no=#{cmNo}")
    Comments selectOne(int postNo, int cmNo);

    //  특정 게시 글 댓글 작성
    @Options(keyColumn = "cm_no", useGeneratedKeys = true, keyProperty = "cmNo")
    @Insert("insert into \"Comments\" (post_no, cm_content, cm_writer, cm_datetime) values (#{postNo},#{cmContent},#{cmWriter},now())")
    int insertOne(Comments comments);

    //  특정 게시 글 댓글 수정
    @Update("update \"Comments\" set cm_content=#{cmContent} where post_no=#{postNo} and cm_no=#{cmNo} and cm_writer=#{cmWriter}")
    int updateOne(Comments comments);

    //  특정 게시 글 댓글 삭제
    @Delete("delete from \"Comments\" where post_no=#{postNo} and cm_no=#{cmNo} and cm_writer=#{memNo}")
    int deleteOne(int postNo, int cmNo, int memNo);
}
