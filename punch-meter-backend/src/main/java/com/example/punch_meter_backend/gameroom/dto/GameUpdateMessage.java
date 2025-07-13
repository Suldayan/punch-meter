package com.example.punch_meter_backend.gameroom.dto;

public record GameUpdateMessage(
        RoomStateResponse roomState,
        PlayerActionEvent playerActionEvent,
        String targetDeviceId,
        long timestamp
) {}