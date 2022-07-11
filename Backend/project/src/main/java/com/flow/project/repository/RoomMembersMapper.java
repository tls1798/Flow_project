package com.flow.project.repository;

import com.flow.project.domain.RoomMembers;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface RoomMembersMapper {

    // 멤버 별 프로젝트 리스트
    @Select("select * from \"Room_Members\" where mem_no=#{memNo}")
    List<RoomMembers> selectRooms(int memNo);

    // 프로젝트 별 참여자 리스트
    @Select("select * from \"Room_Members\" where rm_no=#{rmNo}")
    List<RoomMembers> selectMembers(int rmNo);

    // 프로젝트에 멤버 초대
    @Insert("insert into \"Room_Members\" values (#{rmNo}, #{memNo})")
    int insertOne(RoomMembers roomMember);

    // 프로젝트 나가기
    @Delete("delete from \"Room_Members\" where rm_no=#{rmNo} AND mem_no=#{memNo}")
    int deleteOne(RoomMembers roomMember);
}
