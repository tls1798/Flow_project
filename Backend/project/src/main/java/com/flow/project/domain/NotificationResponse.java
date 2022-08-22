package com.flow.project.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@Builder
public class NotificationResponse {
    // String -> JSON
    private int ntNo;
    private int ntTypeNo;
    private int ntDetailNo;
    private String memNo;
    private String ntDatetime;
    private String rmNo;
    private String memName;
    private String rmTitle;
    private String notiContent;
    private Map<String, String> ntCheck;
    private int ntCount;
    private int postNo;
}