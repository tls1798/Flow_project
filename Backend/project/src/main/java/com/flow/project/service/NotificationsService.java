package com.flow.project.service;

import com.flow.project.domain.Notifications;
import com.flow.project.repository.NotificationsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationsService {

    private final NotificationsMapper notificationsMapper;

    // 글, 댓글, 초대 알림 추가
    public int addNotification(Notifications bean) {
        return notificationsMapper.insertOne(bean);
    }

    // 글, 댓글, 초대 알림 수정
    public int editNotification(Notifications bean) {
        return notificationsMapper.updateOne(bean);
    }
}
