package com.flow.project.repository;

import com.flow.project.domain.Members;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Mapper
public interface MembersMapper {

    // 회원 한 명
    @Select("select * from \"Members\" where mem_no=#{memNo}")
    Members findOne(int memNo);
    // 회원전체
    @Select("select * from \"Members\"")
    List<Members> findAll();
    // 회원가입
    @Options(keyColumn = "idx", useGeneratedKeys = true)
    @Insert("insert into \"Member\" (email, name, password) values (#{email},#{name},#{password})")
    int insertOne(Members member);
    //mem_no mem_mail

    // 이름으로 찾는다
    @Select("select * from \"Members\" where mem_name=#{memName}")
    Members findByname(String memName);
}
