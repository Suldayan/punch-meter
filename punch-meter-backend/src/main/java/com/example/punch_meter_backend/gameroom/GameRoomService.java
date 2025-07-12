package com.example.punch_meter_backend.gameroom;

import com.example.punch_meter_backend.player.PlayerController;

import java.util.List;
import java.util.Optional;

public interface GameRoomService {
    GameRoom createRoom(String roomName, String hostDeviceId);
    Optional<PlayerController> joinRoom(String roomCode, String playerName, String deviceId, String sessionId);
    void leaveRoom(String sessionId);
    Optional<GameRoom> getRoom(String roomCode);
    List<PlayerController> getRoomPlayers(String roomCode);
}
