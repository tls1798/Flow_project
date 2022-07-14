package com.flow.project.repository;

import com.flow.project.domain.Favorites;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FavoritesMapper {

    // 즐겨찾는 프로젝트로 등록
    @Insert("insert into \"Favorites\" values (#{rmNo}, #{memNo})")
    int insertOne(Favorites favorite);

    // 즐겨찾는 프로젝트 취소
    @Delete("delete from \"Favorites\" where rm_no=#{rmNo} AND mem_no=#{memNo}")
    int deleteOne(Favorites favorite);
}
