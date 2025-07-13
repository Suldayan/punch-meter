package com.example.punch_meter_backend.gameroom.internal;

import com.example.punch_meter_backend.gameroom.GameRoom;
import com.example.punch_meter_backend.gameroom.dto.RoomStateResponse;

public record CreateRoomResult(
        GameRoom room,
        RoomStateResponse roomState,
        boolean success,
        String errorMessage
) {}
