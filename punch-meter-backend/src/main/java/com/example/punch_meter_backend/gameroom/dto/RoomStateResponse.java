package com.example.punch_meter_backend.gameroom.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomStateResponse {
    private String roomCode;
    private String roomName;
    private String hostDeviceId;
    private int currentPlayers;
    private int maxPlayers;
    private String status;
    private List<PlayerInfo> players;
}