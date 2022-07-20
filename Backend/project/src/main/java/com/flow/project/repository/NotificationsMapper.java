package com.flow.project.repository;

import com.flow.project.domain.Notifications;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface NotificationsMapper {

    // 글, 댓글, 초대 알림 추가
    @Options(keyColumn = "nt_no", useGeneratedKeys = true)
    @Insert("insert into " +
            "notis (nt_type_no, nt_detail_no, mem_no, nt_datetime, rm_no, nt_temp) " +
            "values (#{ntTypeNo}, #{ntDetailNo}, #{memNo}, now(), #{rmNo}, #{ntTemp}::jsonb)")
    int insertOne(Notifications notifications);

    // 글, 댓글, 초대 알림 수정
    @Update("update notis set nt_temp = jsonb_set(nt_temp, concat('{',#{memNo},'}')::text[], to_char(now(),'\\\"YYYY-MM-DD HH:mm\\\"')::jsonb, true)  where nt_no = #{ntNo}")
    int updateOne(Notifications notifications);
}
