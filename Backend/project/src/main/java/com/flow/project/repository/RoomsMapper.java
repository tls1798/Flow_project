package com.flow.project.repository;

import com.flow.project.domain.ProjectListData;
import com.flow.project.domain.Rooms;
import org.apache.ibatis.annotations.*;

@Mapper
public interface RoomsMapper {

    // 프로젝트 조회 (프로젝트 삭제 시 확인용)
    @Select("select * from \"Rooms\" where rm_no=#{rmNo}")
    Rooms selectOne(String rmNo);

    // 프로젝트 조회 (프로젝트 리스트에서 프로젝트 선택)
    @Select("select r.rm_no, r.rm_title, r.rm_des, r.rm_admin, " +
            "(select rm_no from \"Favorites\" f where f.rm_no=#{rmNo} and f.mem_no=#{memNo}) as favorite_project " +
            "from \"Rooms\" r where rm_no=#{rmNo}")
    ProjectListData selectRoom(String rmNo, String memNo);

    // 프로젝트 생성
    @Insert("insert into \"Rooms\" (rm_no, rm_title, rm_des, rm_admin) values (#{rmNo}, #{rmTitle}, #{rmDes}, #{rmAdmin})")
    int insertOne(Rooms room);

    // 프로젝트 수정
    @Update("update \"Rooms\" set rm_title=#{rmTitle}, rm_des=#{rmDes} where rm_no=#{rmNo}")
    int updateOne(Rooms room);

    // 프로젝트 삭제
    @Delete("delete from \"Rooms\" where rm_no=#{rmNo}")
    void deleteOne(String rmNo);
}