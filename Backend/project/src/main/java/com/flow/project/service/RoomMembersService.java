package com.flow.project.service;

import com.flow.project.domain.RoomMembers;
import com.flow.project.repository.RoomMembersMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomMembersService {

    final RoomMembersMapper roomMembersMapper;

    // 멤버 별 프로젝트 리스트
    public List<RoomMembers> getRooms(int memNo){
        return roomMembersMapper.selectRooms(memNo);
    }

    // 프로젝트 별 참여자 리스트
    public List<RoomMembers> getMembers(int rmNo){
        return roomMembersMapper.selectMembers(rmNo);
    }

    // 프로젝트에 멤버 초대
    public boolean addMember(RoomMembers roomMember){
        return roomMembersMapper.insertOne(roomMember)>0;
    }

    // 프로젝트 나가기
    public boolean removeMember(RoomMembers roomMember){
        return roomMembersMapper.deleteOne(roomMember)>0;
    }
}
