package com.flow.project.repository;

import com.flow.project.domain.Posts;
import org.apache.ibatis.annotations.*;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Mapper
public interface PostsMapper {

    // 특정 프로젝트 방 특정 글 하나 가져오기
    @Select("select p.post_no, p.rm_no, p.post_writer, p.post_title, p.post_content, p.post_pin, " +
            "to_char(p.post_datetime, 'YYYY-MM-DD HH24:MI') post_datetime, to_char(p.post_edit_datetime, 'YYYY-MM-DD HH24:MI') post_edit_datetime, " +
            "(select r.rm_title from \"Rooms\" r where r.rm_no = p.rm_no) as rm_title, " +
            "(select m.mem_name from \"Members\" m where m.mem_no = p.post_writer) as post_name, " +
            "(select count(*) from bookmark b where b.mem_no = #{memNo} and b.post_no = #{postNo}) as post_bookmark, " +
            "(select count(*) from \"Notis\" n, jsonb_each_text(n.nt_check) where n.nt_type_no = 1 and n.post_no = p.post_no and n.nt_check -> key != 'null') as post_read_count " +
            "from \"Posts\" p " +
            "where rm_no = #{rmNo} and p.post_no = #{postNo}")
    Posts selectOne(int memNo, String rmNo, int postNo);

    // 특정 프로젝트 방 글 작성
    @Options(keyColumn = "post_no", useGeneratedKeys = true, keyProperty = "postNo")
    @Insert("insert into \"Posts\" (rm_no, post_writer, post_title, post_content, post_datetime) values (#{rmNo}, #{postWriter}, #{postTitle}, #{postContent}, now())")
    int insertOne(Posts post);

    // 특정 프로젝트 방 글 수정
    @Update("update \"Posts\" set post_title = #{postTitle}, post_content = #{postContent}, post_edit_datetime = now() where rm_no = #{rmNo} and post_no = #{postNo}")
    int updateOne(Posts post);

    // 특정 프로젝트 방 글 삭제
    @Delete("delete from \"Posts\" where rm_no = #{rmNo} and post_no = #{postNo} and post_writer = #{memNo}")
    int deleteOne(String rmNo, int postNo, int memNo);

    // 상단고정 업데이트하기
    @Update("update \"Posts\" set post_pin = #{postPin} where post_no = #{postNo}")
    int updatePin(int postNo,int postPin);
}
