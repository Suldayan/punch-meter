package com.example.punch_meter_backend.gameroom.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerReadyResult {
    private RoomStateResponse roomState;
    private PlayerActionEvent playerActionEvent;
    private boolean success;
    private String errorMessage;

    // Convenience constructors
    public PlayerReadyResult(RoomStateResponse roomState, PlayerActionEvent playerActionEvent) {
        this.roomState = roomState;
        this.playerActionEvent = playerActionEvent;
        this.success = true;
        this.errorMessage = null;
    }

    public PlayerReadyResult(String errorMessage) {
        this.roomState = null;
        this.playerActionEvent = null;
        this.success = false;
        this.errorMessage = errorMessage;
    }

    public boolean success() {
        return success;
    }

    public String errorMessage() {
        return errorMessage;
    }
}