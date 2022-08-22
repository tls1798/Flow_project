package com.flow.project.repository;

import com.flow.project.domain.AuthDTO;
import com.flow.project.domain.Members;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MembersMapper {

    // 회원 한 명
    @Select("select mem_no,mem_mail, mem_name, mem_pw from \"Members\" where mem_no=#{memNo}")
    Members selectOne(String memNo);

    // 회원전체
    @Select("select mem_no,mem_mail, mem_name, mem_pw from \"Members\"")
    List<Members> selectAll();

    // 회원가입
    @Insert("insert into \"Members\" (mem_no,mem_mail, mem_name, mem_pw) values (#{memNo},#{memMail},#{memName},#{memPw})")
    int insertOne( AuthDTO.SignupDTO signupDTO);

    //mem_no mem_mail
    @Select("SELECT mem_mail FROM \"Members\" WHERE mem_mail = #{email}")
    String findmailByEmail(String email);

    // 토큰 삭제
    @Delete("delete from \"RefreshToken\" where mem_no=#{memNo}")
    int deleteOne(String memNo);

    // 회원 탈퇴
    @Delete("delete from \"Members\" where mem_no=#{memNo}")
    boolean deleteMem(String memNo);
}
