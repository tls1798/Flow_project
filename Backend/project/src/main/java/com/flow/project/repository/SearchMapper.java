package com.flow.project.repository;

import com.flow.project.domain.SearchDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface SearchMapper {

    @Select("select p.post_no,p.post_title ,(select r.rm_title  from \"Rooms\" r where r.rm_no = p.rm_no)," +
            "(select m.mem_name from \"Members\" m where m.mem_no=p.post_writer) as post_writer," +
            "(select r.rm_no  from \"Rooms\" r where r.rm_no = p.rm_no) ," +
            "p.post_datetime from \"Posts\" p where p.post_title like '%'||#{search}||'%' or p.post_content like '%'||#{search}||'%'")
    List<SearchDTO.PostSearchDTO> getPostInfo(String search);

    @Select("select c.cm_no ,c.cm_content,(select m.mem_name from \"Members\" m where m.mem_no= c.cm_writer) as cm_writer," +
            "(select r.rm_title  from \"Rooms\" r where r.rm_no = (select p.rm_no  from \"Posts\" p where p.post_no = c.post_no))," +
            "(select r.rm_no  from \"Rooms\" r where r.rm_no = (select p.rm_no  from \"Posts\" p where p.post_no = c.post_no)) ," +
            "c.cm_datetime  from \"Comments\" c where c.cm_content like '%'||#{search}||'%'")
    List<SearchDTO.CmSearchDTO> getCmInfo(String search);

    @Select("select r.rm_no,r.rm_title from \"Rooms\" r where r.rm_title like '%'||#{search}||'%'")
    List<SearchDTO.RoomSearchDTO> getRoomInfo(String search);
}
