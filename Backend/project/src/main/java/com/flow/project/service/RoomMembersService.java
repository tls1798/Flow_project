package com.flow.project.service;

import com.flow.project.domain.Participant;
import com.flow.project.domain.ProjectListData;
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
    public List<ProjectListData> getRooms(String memNo) {
        return roomMembersMapper.selectRooms(memNo);
    }

    // 프로젝트 별 참여자 리스트
    public List<Participant> getMembers(String rmNo) {
        return roomMembersMapper.selectMembers(rmNo);
    }

    // 참여자 가져오기
    public List<String> getParticipants(String rmNo, String memNo) {
        return roomMembersMapper.selectAllParticipants(rmNo, memNo);
    }

    // 프로젝트에 멤버 초대
    public boolean addMember(List<RoomMembers> roomMembers) {
        try {
            // 여러명 한 번에 초대할 수 있으므로 List를 돌며 insert
            for (RoomMembers roomMember : roomMembers)
                roomMembersMapper.insertOne(roomMember);

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // 프로젝트 나가기
    public boolean removeMember(RoomMembers roomMember) {
        return roomMembersMapper.deleteOne(roomMember) > 0;
    }
}
