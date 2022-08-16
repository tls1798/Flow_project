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
    @Select("SELECT mem_mail FROM \"Members\" WHERE mem_No = #{memNo}")
    String findMail(int memNo);


    // JwtProvider 회원 번호의 리프레쉬 토큰과 일치하는지 확인하기 위함
    @Select("SELECT refresh_token FROM \"RefreshToken\" WHERE mem_No = #{memNo}")
    String findByRefreshToken(int memNo);

    // 토큰 회원 정보가 있으면 update / 없으면 insert /하기 위해서 회원정보 조회
    @Select("SELECT mem_no from \"RefreshToken\" WHERE mem_no = #{memNo}")
    int checkOne(int memNo);

    //패스워드 재발급
    @Options(keyColumn = "mem_no", useGeneratedKeys = true)
    @Insert("Update \"Members\" set mem_pw=#{memPw} where mem_mail=#{memMail}")
    int newPassword(Members member);

    // 리프레쉬 토큰 발급 시 insert or update 시 사용
    @Options(keyColumn = "rt_no", useGeneratedKeys = true)
    @Insert("Insert into \"RefreshToken\" (mem_no,refresh_token) values(#{memNo},#{refreshToken})")
    void insertRefreshToken(RefreshToken refreshToken);

    // 리프레쉬 토큰 발급 시 insert or update 시 사용
    @Options(keyColumn = "rt_no", useGeneratedKeys = true)
    @Insert("Update \"RefreshToken\" set refresh_token=#{refreshToken} where mem_no=#{memNo}")
    void UpdateRefreshToken(RefreshToken refreshToken);
}
