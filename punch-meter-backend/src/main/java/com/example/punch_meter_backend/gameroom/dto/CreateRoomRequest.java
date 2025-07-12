package com.example.punch_meter_backend.gameroom.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateRoomRequest {
    private String roomName;
    private String deviceId; // Host device ID
}