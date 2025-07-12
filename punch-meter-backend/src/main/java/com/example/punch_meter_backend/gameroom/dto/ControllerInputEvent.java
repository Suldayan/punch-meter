package com.example.punch_meter_backend.gameroom.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ControllerInputEvent {
    private String roomCode;
    private String deviceId;
    private String inputType; // "tap", "swipe", "punch_ready", etc.
    private Object data; // Additional data for the input
}