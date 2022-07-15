package com.flow.project.domain;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RefreshToken {

    private long idx;
    private long memNo;
    private String refreshToken;
}
