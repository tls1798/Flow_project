package com.flow.project.service;

import com.flow.project.domain.ProjectListData;
import com.flow.project.domain.RoomMembers;
import com.flow.project.domain.Rooms;
import com.flow.project.repository.RoomMembersMapper;
import com.flow.project.repository.RoomsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoomsService {

    final RoomsMapper roomsMapper;
    final RoomMembersMapper roomMembersMapper;

    // 프로젝트 조회 (프로젝트 삭제 시 확인용)
    public Rooms getRoom(String rmNo) {
        return roomsMapper.selectOne(rmNo);
    }

    // 프로젝트 조회 (프로젝트 리스트에서 프로젝트 선택)
    public ProjectListData getSelectedRoom(String rmNo, int memNo){
        return roomsMapper.selectRoom(rmNo, memNo);
    }

    // 프로젝트 생성
    public boolean addRoom(Rooms room) {

        if (roomsMapper.insertOne(room)>0){

            // 프로젝트 생성 성공 시 멤버로 초대
            RoomMembers roomMembers = new RoomMembers(room.getRmNo(), room.getRmAdmin());
            roomMembersMapper.insertOne(roomMembers);

            return true;
        }

        return false;
    }

    // 프로젝트 수정
    public Rooms editRoom(Rooms room) {
        if (roomsMapper.updateOne(room) > 0)
            return room;
        return null;
    }

    // 프로젝트 삭제
    public Rooms removeRoom(String rmNo) {
        Rooms target = getRoom(rmNo);
        if (target != null)
            roomsMapper.deleteOne(rmNo);
        return target;
    }
}
