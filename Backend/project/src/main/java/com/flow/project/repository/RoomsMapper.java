package com.flow.project.repository;

import com.flow.project.domain.Rooms;
import org.apache.ibatis.annotations.*;

@Mapper
public interface RoomsMapper {

    // 프로젝트 번호로 프로젝트 선택
    @Select("select * from \"Rooms\" where rm_no=#{rmNo}")
    Rooms selectOne(int rmNo);

    // 프로젝트 생성
    @Options(keyColumn = "rm_no", useGeneratedKeys = true)
    @Insert("insert into \"Rooms\" (rm_title, rm_des, rm_admin) values (#{rmTitle}, #{rmDes}, #{rmAdmin})")
    int insertOne(Rooms room);

    // 프로젝트 수정
    @Update("update \"Rooms\" set rm_title=#{rmTitle}, rm_des=#{rmDes} where rm_no=#{rmNo}")
    int updateOne(Rooms room);

    // 프로젝트 삭제
    @Delete("delete from \"Rooms\" where rm_no=#{rmNo}")
    void deleteOne(int rmNo);
}