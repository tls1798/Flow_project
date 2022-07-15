package com.flow.project.service;

import com.flow.project.domain.Rooms;
import com.flow.project.repository.RoomsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoomsService {

    final RoomsMapper roomsMapper;

    // 프로젝트 번호로 프로젝트 선택
    public Rooms getRoom(String rmNo) {
        return roomsMapper.selectOne(rmNo);
    }

    // 프로젝트 생성
    public boolean addRoom(Rooms room){
        return roomsMapper.insertOne(room)>0;
    }

    // 프로젝트 수정
    public Rooms editRoom(Rooms room){
        if(roomsMapper.updateOne(room)>0)
            return room;
        return null;
    }

    // 프로젝트 삭제
    public Rooms removeRoom(String rmNo){
        Rooms target = getRoom(rmNo);
        if(target!=null)
            roomsMapper.deleteOne(rmNo);
        return target;
    }
}
