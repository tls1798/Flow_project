package com.flow.project.repository;

import com.flow.project.domain.SearchDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface SearchMapper {

    // 글 검색결과
    @Select("select p.post_no, " +
                "case " +
                    "when (p.post_title='') then p.post_content " +
                    "else p.post_title " +
                "end as search_content, " +
                "to_char(p.post_datetime, 'YYYY-MM-DD HH24:MI') as search_datetime, " +
                "(select m.mem_name from \"Members\" m where m.mem_no=p.post_writer) as search_writer, " +
                "(select r.rm_no  from \"Rooms\" r where r.rm_no = p.rm_no), " +
                "(select r.rm_title  from \"Rooms\" r where r.rm_no = p.rm_no) " +
            "from \"Posts\" p, \"Room_Members\" rmmems " +
            "where (p.post_title like '%'||#{search}||'%' or p.post_content like '%'||#{search}||'%') " +
                "and (p.rm_no=rmmems.rm_no and rmmems.mem_no=#{memNo})")
    List<SearchDTO.CmPostSearchDTO> getPostInfo(String search, int memNo);

    // 댓글 검색결과
    @Select("select c.cm_no, c.post_no, c.cm_content as search_content, " +
                "(select m.mem_name from \"Members\" m where m.mem_no= c.cm_writer) as search_writer, " +
                "to_char(c.cm_datetime, 'YYYY-MM-DD HH24:MI') as search_datetime, " +
                "(select r.rm_no from \"Rooms\" r where r.rm_no = (select p.rm_no from \"Posts\" p where p.post_no = c.post_no)), " +
                "(select r.rm_title from \"Rooms\" r where r.rm_no = (select p.rm_no from \"Posts\" p where p.post_no = c.post_no)) " +
            "from \"Comments\" c, \"Room_Members\" rmmems " +
            "where c.cm_content like '%'||#{search}||'%' " +
                "and ((select r.rm_no from \"Rooms\" r where r.rm_no = (select p.rm_no from \"Posts\" p where p.post_no = c.post_no)) = rmmems.rm_no and rmmems.mem_no = #{memNo})")
    List<SearchDTO.CmPostSearchDTO> getCmInfo(String search, int memNo);

    // 프로젝트 검색결과
    @Select("select " +
                "r.rm_no, r.rm_title, " +
                "(select f.rm_no from \"Favorites\" as f where r.rm_no=f.rm_no and f.mem_no=#{memNo}) as favorite_project " +
            "from \"Rooms\" r, \"Room_Members\" rmmems " +
            "where r.rm_title like '%'||#{search}||'%'" +
                "and r.rm_no=rmmems.rm_no and rmmems.mem_no=#{memNo}")
    List<SearchDTO.RoomSearchDTO> getRoomInfo(String search, int memNo);
}
