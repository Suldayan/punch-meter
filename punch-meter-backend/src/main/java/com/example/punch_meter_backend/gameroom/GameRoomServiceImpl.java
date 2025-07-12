package com.example.punch_meter_backend.gameroom;

import com.example.punch_meter_backend.player.PlayerController;
import com.example.punch_meter_backend.player.PlayerControllerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameRoomServiceImpl implements GameRoomService {
    private final GameRoomRepository gameRoomRepository;
    private final PlayerControllerRepository playerControllerRepository;

    @Transactional
    @Override
    public GameRoom createRoom(String roomName, String hostDeviceId) {
        // Check if host already has a room
        Optional<GameRoom> existingRoom = gameRoomRepository.findByHostDeviceId(hostDeviceId);
        if (existingRoom.isPresent()) {
            return existingRoom.get(); // Return existing room
        }

        GameRoom room = new GameRoom();
        room.setRoomCode(generateUniqueRoomCode());
        room.setRoomName(roomName);
        room.setHostDeviceId(hostDeviceId);
        room.setCreatedAt(LocalDateTime.now());

        GameRoom savedRoom = gameRoomRepository.save(room);
        log.info("Created new game room: {} with code: {}", roomName, savedRoom.getRoomCode());
        return savedRoom;
    }


    @Transactional
    @Override
    public Optional<PlayerController> joinRoom(String roomCode, String playerName, String deviceId, String sessionId) {
        Optional<GameRoom> roomOpt = gameRoomRepository.findByRoomCode(roomCode);
        if (roomOpt.isEmpty()) {
            log.warn("Attempted to join non-existent room: {}", roomCode);
            return Optional.empty();
        }

        GameRoom room = roomOpt.get();

        // Check if room is full
        if (room.getCurrentPlayerCount() >= room.getMaxPlayers()) {
            log.warn("Room {} is full, cannot join", roomCode);
            return Optional.empty();
        }

        // Check if device already connected to this room
        Optional<PlayerController> existingController =
                playerControllerRepository.findByDeviceIdAndGameRoom_RoomCode(deviceId, roomCode);
        if (existingController.isPresent()) {
            // Update session ID and return existing controller
            PlayerController controller = existingController.get();
            controller.setSessionId(sessionId);
            controller.setStatus(PlayerController.ControllerStatus.CONNECTED);
            return Optional.of(playerControllerRepository.save(controller));
        }

        // Create new controller
        PlayerController controller = new PlayerController();
        controller.setPlayerName(playerName);
        controller.setDeviceId(deviceId);
        controller.setSessionId(sessionId);
        controller.setGameRoom(room);
        controller.setJoinedAt(LocalDateTime.now());

        PlayerController savedController = playerControllerRepository.save(controller);
        log.info("Player {} joined room {} with device {}", playerName, roomCode, deviceId);
        return Optional.of(savedController);
    }

    @Transactional
    @Override
    public void leaveRoom(String sessionId) {
        Optional<PlayerController> controllerOpt = playerControllerRepository.findBySessionId(sessionId);
        if (controllerOpt.isPresent()) {
            PlayerController controller = controllerOpt.get();
            String roomCode = controller.getGameRoom().getRoomCode();
            String playerName = controller.getPlayerName();

            playerControllerRepository.deleteBySessionId(sessionId);
            log.info("Player {} left room {}", playerName, roomCode);
        }
    }

    @Override
    public Optional<GameRoom> getRoom(String roomCode) {
        return gameRoomRepository.findByRoomCode(roomCode);
    }

    @Override
    public List<PlayerController> getRoomPlayers(String roomCode) {
        return playerControllerRepository.findByGameRoom_RoomCode(roomCode);
    }

    private String generateUniqueRoomCode() {
        String code;
        do {
            code = generateRandomCode();
        } while (gameRoomRepository.existsByRoomCode(code));
        return code;
    }

    private String generateRandomCode() {
        // Generate 4-character code for party games (easier to type on phones)
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder code = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 4; i++) {
            code.append(chars.charAt(random.nextInt(chars.length())));
        }
        return code.toString();
    }
}
