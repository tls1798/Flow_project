package com.flow.project.repository;

import com.flow.project.domain.Members;
import com.flow.project.domain.RefreshToken;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface AuthMapper {

    // userDetailsService 클래스에서 사용
    @Select("SELECT * FROM \"Members\" WHERE mem_mail = #{memMail}")
    Members findByEmail(String memMail);

    @Select("SELECT mem_no FROM \"Members\" WHERE mem_mail = #{memMail}")
    int findNo(String memMail);

    // AuthService에서 리프레쉬 토큰 발급시 사용
    @Select("SELECT refresh_token FROM \"RefreshToken\" WHERE mem_No = #{memNo}")
    String findByrefreshToken(int memNo);

    // 토큰 회원 정보가 있으면 update / 없으면 insert /하기 위해서 회원정보 조회
    @Select("SELECT mem_no from \"RefreshToken\" WHERE mem_no = #{memNo}")
    int checkone(int memNo);

    // 리프레쉬 토큰 발급 시 insert or update 시 사용
    @Options(keyColumn = "rt_no", useGeneratedKeys = true)
    @Insert("Insert into \"RefreshToken\" (mem_no,refresh_token) values(#{memNo},#{refreshToken})")
    void insertefreshToken(RefreshToken refreshToken);

    @Options(keyColumn = "rt_no", useGeneratedKeys = true)
    @Insert("Update \"RefreshToken\" set refresh_token=#{refreshToken} where mem_no=#{memNo}")
    void UpdateRefreshToken(RefreshToken refreshToken);


}
