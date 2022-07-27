package com.flow.project.domain;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Notifications {
    private int ntNo;
    private int ntTypeNo;
    private int ntDetailNo;
    private int memNo;
    private String ntDatetime;
    private String rmNo;
    private String memName;
    private String rmTitle;
    private String notiContent;
    private String ntTemp;
    private int ntCount;

    public NotificationResponse toNotificationResponse() throws JsonProcessingException {

        // String -> JSON
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, String> map = objectMapper.readValue(ntTemp, Map.class);

        return NotificationResponse.builder()
                .ntNo(ntNo)
                .ntTypeNo(ntTypeNo)
                .ntDetailNo(ntDetailNo)
                .memNo(memNo)
                .ntDatetime(ntDatetime)
                .rmNo(rmNo)
                .memName(memName)
                .rmTitle(rmTitle)
                .notiContent(notiContent)
                .ntTemp(map)
                .ntCount(ntCount)
                .build();
    }
}