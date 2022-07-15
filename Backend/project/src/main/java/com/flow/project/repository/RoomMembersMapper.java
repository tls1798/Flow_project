package com.flow.project.repository;

import com.flow.project.domain.Participant;
import com.flow.project.domain.ProjectListData;
import com.flow.project.domain.RoomMembers;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface RoomMembersMapper {

    // 멤버 별 프로젝트 리스트
    @Select("select rmmems.rm_no, rms.rm_title, " +
            "(select count(*) from \"Room_Members\" as rmmems2 where rmmems2.rm_no=rmmems.rm_no group by rm_no) as rm_mem_count, " +
            "(select rm_no from \"Favorites\" where rm_no=rmmems.rm_no) as favorite_project " +
            "from \"Room_Members\" as rmmems " +
            "inner join \"Rooms\" as rms on rmmems.rm_no=rms.rm_no " +
            "and rmmems.mem_no=#{memNo}")
    List<ProjectListData> selectRooms(int memNo);

    // 프로젝트 별 참여자 리스트
    @Select("select rmmems.rm_no, rmmems.mem_no, rms.rm_admin, (select mems2.mem_name as admin_name from \"Members\" mems2 where mem_no=rms.rm_admin), mems.mem_name " +
            "from \"Room_Members\" as rmmems " +
            "inner join \"Rooms\" as rms on rmmems.rm_no=rms.rm_no AND rmmems.rm_no = #{rmNo} " +
            "inner join \"Members\" mems on rmmems.mem_no=mems.mem_no")
    List<Participant> selectMembers(String rmNo);

    // 프로젝트에 멤버 초대
    @Insert("insert into \"Room_Members\" values (#{rmNo}, #{memNo})")
    int insertOne(RoomMembers roomMember);

    // 프로젝트 나가기
    @Delete("delete from \"Room_Members\" where rm_no=#{rmNo} AND mem_no=#{memNo}")
    int deleteOne(RoomMembers roomMember);
}
