package com.flow.project.service;

import com.flow.project.domain.SearchDTO;
import com.flow.project.repository.SearchMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class SearchService {

    final SearchMapper searchMapper;

    public List<Object> getInfo(String search, int memNo){

        List<SearchDTO.CmPostSearchDTO> postResult =  searchMapper.getPostInfo(search, memNo);
        List<SearchDTO.CmPostSearchDTO> cmResult =  searchMapper.getCmInfo(search, memNo);
        List<SearchDTO.CmPostSearchDTO> postAndCm = new ArrayList<>();
        postAndCm.addAll(postResult);
        postAndCm.addAll(cmResult);

        Collections.sort(postAndCm, new Comparator<SearchDTO.CmPostSearchDTO>() {
            @Override
            public int compare(SearchDTO.CmPostSearchDTO o1, SearchDTO.CmPostSearchDTO o2) {
                if(o1.getSearchDatetime().compareTo(o2.getSearchDatetime())<0) {
                    return 1;
                }
                return -1;
            }
        });

        List<Object> result = new ArrayList<>(postAndCm);
        result.add(searchMapper.getRoomInfo(search, memNo));
        return result;
    }
}
