package com.flow.project.service;

import com.flow.project.repository.SearchMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SearchService {
    final SearchMapper searchMapper;
    public Map<String, Object> getInfo(String search){
        Map<String, Object> result = new HashMap<>();
        result.put("Comments",searchMapper.getCmInfo(search));
        result.put("Posts",searchMapper.getPostInfo(search));
        result.put("Rooms",searchMapper.getRoomInfo(search));
        return result;
    }
}
