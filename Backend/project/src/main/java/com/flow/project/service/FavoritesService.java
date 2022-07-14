package com.flow.project.service;

import com.flow.project.domain.Favorites;
import com.flow.project.repository.FavoritesMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FavoritesService {

    final FavoritesMapper favoritesMapper;

    // 즐겨찾는 프로젝트로 등록
    public boolean addFavorite(Favorites favorite){
        return favoritesMapper.insertOne(favorite)>0;
    }

    // 즐겨찾는 프로젝트 취소
    public boolean removeFavorite(Favorites favorite){
        return favoritesMapper.deleteOne(favorite)>0;
    }
}
