package com.flow.project.repository;

import com.flow.project.domain.SearchDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface SearchMapper {

    @Select("select p.post_no, " +
                "case " +
                    "when (p.post_title='') then p.post_content " +
                    "else p.post_title " +
                "end as search_content, " +
                "to_char(p.post_datetime, 'YYYY-MM-DD HH24:MI') as search_datetime, " +
                "(select m.mem_name from \"Members\" m where m.mem_no=p.post_writer) as search_writer, " +
                "(select r.rm_no  from \"Rooms\" r where r.rm_no = p.rm_no), " +
                "(select r.rm_title  from \"Rooms\" r where r.rm_no = p.rm_no) " +
            "from \"Posts\" p " +
            "where p.post_title like '%'||#{search}||'%' or p.post_content like '%'||#{search}||'%'")
    List<SearchDTO.CmPostSearchDTO> getPostInfo(String search);

    @Select("select c.cm_no, c.post_no, c.cm_content as search_content, " +
                "(select m.mem_name from \"Members\" m where m.mem_no= c.cm_writer) as search_writer, " +
                "to_char(c.cm_datetime, 'YYYY-MM-DD HH24:MI') as search_datetime, " +
                "(select r.rm_no from \"Rooms\" r where r.rm_no = (select p.rm_no from \"Posts\" p where p.post_no = c.post_no)), " +
                "(select r.rm_title from \"Rooms\" r where r.rm_no = (select p.rm_no from \"Posts\" p where p.post_no = c.post_no)) " +
            "from \"Comments\" c " +
            "where c.cm_content like '%'||#{search}||'%'")
    List<SearchDTO.CmPostSearchDTO> getCmInfo(String search);

    @Select("select r.rm_no,r.rm_title from \"Rooms\" r where r.rm_title like '%'||#{search}||'%'")
    List<SearchDTO.RoomSearchDTO> getRoomInfo(String search);
}
