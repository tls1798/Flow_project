package com.flow.project.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.Map;

@Getter
@Setter
@Builder
public class NotificationResponse {
    // String -> JSON
    private int ntNo;
    private int ntTypeNo;
    private int ntDetailNo;
    private int memNo;
    private Date ntDatetime;
    private String rmNo;
    private String memName;
    private String rmTitle;
    private String notiContent;
    private Map<String, String> ntTemp;
    private int ntCount;
}