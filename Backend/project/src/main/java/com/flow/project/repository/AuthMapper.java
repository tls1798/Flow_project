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
    @Select("SELECT * FROM \"Member\" WHERE email = #{email}")
    Members findByEmail(String email);

    // AuthService에서 리프레쉬 토큰 발급시 사용
    @Select("SELECT refresh_token FROM \"RefreshToken\" WHERE idx = #{idx}")
    String findRefreshTokenByIdx(long idx);

    // 리프레쉬 토큰 발급 시 insert or update 시 사용
    @Options(keyColumn = "idx", useGeneratedKeys = true)
    @Insert("Insert into \"RefreshToken\" (user_email, access_token, refresh_token) values(#{userEmail},#{accessToken},#{refreshToken})")
    void insertOrUpdateRefreshToken(RefreshToken refreshToken);

    @Select("Select idx from \"RefreshToken\" where refresh_token = #{refreshToken}")
    void selectidxRefreshToken(String refresh_token);
}
