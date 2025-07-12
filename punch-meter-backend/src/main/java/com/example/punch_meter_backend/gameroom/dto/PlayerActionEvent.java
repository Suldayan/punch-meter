package com.example.punch_meter_backend.gameroom.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlayerActionEvent {
    private String roomCode;
    private String playerName;
    private String deviceId;
    private int totalPlayers;
}