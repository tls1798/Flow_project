package com.flow.project.repository;

import com.flow.project.domain.Notifications;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface NotificationsMapper {


    // 내가 속한 프로젝트 룸 전체 알림 가져오기 (알림레이어)
    @Select("select n.nt_no, n.nt_type_no, nt_detail_no, n.mem_no, " +
            "to_char(n.nt_datetime, 'YYYY-MM-DD HH24:MI') nt_datetime, n.rm_no, n.nt_temp, n.post_no, " +
            "(select m.mem_name from \"Members\" m where m.mem_no = n.mem_no) as mem_name, " +
            "(select r.rm_title from \"Rooms\" r where r.rm_no = n.rm_no) as rm_title," +
            "(select count(*) from notis n where n.mem_no != #{memNo} and n.nt_temp -> concat(#{memNo},'') = 'null') as nt_count, " +
            "case " +
                "when(nt_type_no=1) then (select case " +
                                                    "when (ps.post_title='') then substring(ps.post_content,4,char_length(ps.post_content)-7) " +
                                                    "else ps.post_title end " +
                                            "from \"Posts\" ps where ps.post_no=n.nt_detail_no) " +
                "when(nt_type_no=2) then (select cs.cm_content from \"Comments\" cs where cs.cm_no=n.nt_detail_no) " +
                "else '' " +
            "end as noti_content " +
            "from notis n " +
            "join (select * from \"Room_Members\" rm where rm.mem_no = #{memNo}) as myRooms on myRooms.rm_no = n.rm_no " +
            "where n.mem_no != #{memNo}" +
            "order by nt_no desc")
    List<Notifications> selectAllNotifications(int memNo);

    // 글, 댓글, 초대 알림 추가
    @Options(keyColumn = "nt_no", useGeneratedKeys = true)
    @Insert("insert into " +
            "notis (nt_type_no, nt_detail_no, mem_no, nt_datetime, rm_no, nt_temp, post_no) " +
            "values (#{ntTypeNo}, #{ntDetailNo}, #{memNo}, now(), #{rmNo}, #{ntTemp}::jsonb, #{postNo})")
    int insertOne(Notifications notifications);

    // 글, 댓글, 초대 알림 수정
    @Update("update notis set nt_temp = jsonb_set(nt_temp, concat('{',#{memNo},'}')::text[], " +
            "to_char(now(),'\\\"YYYY-MM-DD HH24:mm\\\"')::jsonb, true)  where nt_no = #{ntNo} or (#{postNo}!=0 and post_no=#{postNo})")
    int updateOne(Notifications notifications);

    // 알림 모두 읽음 (알림레이어)
    @Update("update notis set nt_temp = jsonb_set(nt_temp, concat('{',#{memNo},'}')::text[], " +
            "to_char(now(),'\\\"YYYY-MM-DD HH24:mm\\\"')::jsonb, true)  where nt_temp -> concat(#{memNo}, '') = 'null'")
    int updateAll(int memNo);

    // 프로젝트 별 알림 모두 읽음 (피드 미확인)
    @Update("update notis set nt_temp = jsonb_set(nt_temp, concat('{',#{memNo},'}')::text[], " +
            "to_char(now(),'\\\"YYYY-MM-DD HH24:mm\\\"')::jsonb, true)  where nt_temp -> concat(#{memNo}, '') = 'null' and rm_no = concat(#{rmNo}, '')")
    int updateNotis(int memNo, String rmNo);

    // 댓글 삭제 시 해당 알림 삭제 (댓글)
    @Delete("delete from notis where nt_type_no=2 and nt_detail_no=#{cmNo}")
    int deleteCommentNoti(int cmNo);

    // 프로젝트 삭제 시 해당 알림 삭제 (글, 댓글, 초대)
    @Delete("delete from notis where rm_no=#{rmNo}")
    int deleteRoomNoti(String rmNo);

    // 글 삭제 시 해당 알림 삭제 (글, 댓글)
    @Delete("delete from notis where post_no=#{postNo}")
    int deletePostNoti(int postNo);
}