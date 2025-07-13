package com.example.punch_meter_backend.gameroom.internal;

import com.example.punch_meter_backend.gameroom.dto.PlayerActionEvent;
import com.example.punch_meter_backend.gameroom.dto.RoomStateResponse;
import com.example.punch_meter_backend.player.PlayerController;

import java.util.Optional;

public record JoinRoomResult(
        Optional<PlayerController> controller,
        RoomStateResponse roomState,
        PlayerActionEvent playerActionEvent,
        boolean success,
        String errorMessage
) {}
