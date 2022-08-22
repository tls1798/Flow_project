package com.flow.project.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.flow.project.domain.NotificationResponse;
import com.flow.project.domain.Notifications;
import com.flow.project.repository.NotificationsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationsService {

    private final NotificationsMapper notificationsMapper;

    // 내가 속한 프로젝트 룸 전체 알림 가져오기 (알림레이어)
    public List<NotificationResponse> getNotifications(String memNo) throws JsonProcessingException {
        List<Notifications> notifications = notificationsMapper.selectAllNotifications(memNo);

        List<NotificationResponse> notificationResponses = new ArrayList<>();
        for (Notifications notifications1 : notifications) {
            notificationResponses.add(notifications1.toNotificationResponse());
        }
        return notificationResponses;
    }

    // 글, 댓글, 초대 알림 추가
    public int addNotification(Notifications bean) {
        return notificationsMapper.insertOne(bean);
    }

    // 글, 댓글, 초대 알림 수정
    public int editNotification(Notifications bean) {
        return notificationsMapper.updateOne(bean);
    }

    // 알림 모두 읽음 (알림레이어)
    public int editAllNotifications(String memNo) {
        return notificationsMapper.updateAll(memNo);
    }

    // 프로젝트 별 알림 모두 읽음 (피드 미확인)
    public int editNotifications(String memNo, String rmNo) {
        return notificationsMapper.updateNotis(memNo, rmNo);
    }

    // 댓글 삭제 시 해당 알림 삭제 (댓글)
    public boolean removeCommentNoti(int cmNo) {
        return notificationsMapper.deleteCommentNoti(cmNo)>0;
    }

    // 프로젝트 삭제 시 해당 알림 삭제 (글, 댓글, 초대)
    public boolean removeRoomNoti(String rmNo) {
        return notificationsMapper.deleteRoomNoti(rmNo)>0;
    }

    // 글 삭제 시 해당 알림 삭제 (글, 댓글)
    public boolean removePostNoti(int postNo) {
        return notificationsMapper.deletePostNoti(postNo)>0;
    }

    // 프로젝트 방 나갈 시 알림 json 컬럼에서 내 번호 없애기
    public int deleteRoomNotis(String memNo, String rmNo){
        int result = notificationsMapper.updateRoomNotis(memNo, rmNo);
        if(result>0) notificationsMapper.deleteNoti();

        return result;
    }

    // 특정 프로젝트 방 알림 개수 가져오기 by PostNo
    public int getRoomNotisByPostNo(String memNo, int postNo){
        return notificationsMapper.selectRoomNotisByPostNo(memNo, postNo);
    }

    // 특정 프로젝트 방 알림 개수 가져오기 by rmNo
    public int getRoomNotisByRmNo(String rmNo){
        return notificationsMapper.selectRoomNotisByRmNo(rmNo);
    }
}