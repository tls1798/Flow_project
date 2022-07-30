package com.flow.project.repository;

import com.flow.project.domain.Bookmark;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface BookmarkMapper {
    // 북마크 출력
    @Select("select p.post_title, r.rm_title, m.mem_name, r.rm_no, to_char(p.post_datetime, 'YYYY-MM-DD HH24:MI') post_datetime, b.mem_no, p.post_no, " +
            "(select count(c.cm_no) from \"Comments\" c where c.post_no = p.post_no) as CmCount " +
            "from \"Members\" m, \"Posts\" p, \"Rooms\" r, bookmark b " +
            "where p.post_no = b.post_no and r.rm_no = (select p2.rm_no from \"Posts\" p2 where p2.post_no =b.post_no) and p.post_writer = m.mem_no and b.mem_no = #{memNo}")
    List<Bookmark.BookmarkDTO> selectAll(int memNo);

    // 북마크 추가
    @Insert("insert into bookmark (mem_no,post_no) values(#{memNo},#{postNo})")
    int insertOne(Bookmark bookmark);

    // 북마크 삭제
    @Delete("delete from bookmark where mem_no = #{memNo} and post_no =#{postNo}")
    int deleteOne(Bookmark bookmark);
}
