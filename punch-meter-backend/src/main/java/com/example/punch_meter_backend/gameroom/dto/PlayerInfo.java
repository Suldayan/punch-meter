package com.example.punch_meter_backend.gameroom.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlayerInfo {
    private String playerName;
    private String deviceId;
    private String status;
    private boolean isReady;
    private int score;
}