package com.flow.project.service;

import com.flow.project.domain.Notifications;
import com.flow.project.repository.NotificationsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationsService {

    private final NotificationsMapper notificationsMapper;

    // 내가 속한 프로젝트 룸 전체 알림 가져오기
    public List<Notifications> getNotifications(int memNo){
        return notificationsMapper.selectAllNotifications(memNo);
    }
}
