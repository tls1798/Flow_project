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

    // 내가 속한 프로젝트 룸 전체 알림 가져오기
    public List<NotificationResponse> getNotifications(int memNo) throws JsonProcessingException {
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

    // 알림 모두 읽음
    public int editAllNotifications(int memNo) {
        return notificationsMapper.updateAll(memNo);
    }

    // 프로젝트 별 알림 모두 읽음
    public int editNotifications(int memNo, String rmNo) {
        return notificationsMapper.updateNotis(memNo, rmNo);
    }
}