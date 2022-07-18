package com.flow.project.repository;

import com.flow.project.domain.Notifications;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface NotificationsMapper {

    // 내가 속한 프로젝트 룸 전체 알림 가져오기
    @Select("select n.nt_no, n.nt_type_no, nt_detail_no, n.mem_no, n.nt_datetime, n.rm_no, n.nt_temp, "+
            "(select m.mem_name from \"Members\" m where m.mem_no = n.mem_no) as mem_name, " +
            "(select r.rm_title from \"Rooms\" r where r.rm_no = n.rm_no) as rm_title," +
            "case " +
            "when(nt_type_no=1) then (select ps.post_title from \"Posts\" ps where ps.post_no=n.nt_detail_no) " +
            "when(nt_type_no=2) then (select cs.cm_content from \"Comments\" cs where cs.cm_no=n.nt_detail_no) " +
            "else '' " +
            "end as noti_content " +
            "from notis n " +
            "join (select * from \"Room_Members\" rm where rm.mem_no = #{memNo}) as myRooms on myRooms.rm_no = n.rm_no " +
            "where n.mem_no != #{memNo}" +
            "order by nt_datetime desc")
    List<Notifications> selectAllNotifications(int memNo);
}
