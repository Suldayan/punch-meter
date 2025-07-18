package com.example.punch_meter_backend.gameroom.internal;

import com.example.punch_meter_backend.gameroom.GameRoom;
import com.example.punch_meter_backend.gameroom.GameRoomRepository;
import com.example.punch_meter_backend.gameroom.GameRoomService;
import com.example.punch_meter_backend.gameroom.dto.*;
import com.example.punch_meter_backend.player.PlayerController;
import com.example.punch_meter_backend.player.internal.PlayerControllerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameRoomServiceImpl implements GameRoomService {
    private final GameRoomRepository gameRoomRepository;
    private final PlayerControllerRepository playerControllerRepository;

    @Transactional
    @Override
    public GameRoom createRoom(String roomName, String hostDeviceId) {
        Optional<GameRoom> existingRoom = gameRoomRepository.findByHostDeviceId(hostDeviceId);
        if (existingRoom.isPresent()) {
            return existingRoom.get();
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
        Optional<PlayerController> existingController = playerControllerRepository
                .findByDeviceIdAndGameRoom_RoomCode(deviceId, roomCode);
        if (existingController.isPresent()) {
            // Update session ID and return existing controller
            PlayerController controller = existingController.get();
            controller.setSessionId(sessionId);
            controller.setStatus(PlayerController.ControllerStatus.CONNECTED);
            return Optional.of(playerControllerRepository.save(controller));
        }

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
            GameRoom room = controller.getGameRoom();
            String roomCode = room.getRoomCode();
            String playerName = controller.getPlayerName();

            playerControllerRepository.deleteBySessionId(sessionId);

            // Check if room is now empty and clean it up
            if (room.getCurrentPlayerCount() == 0) {
                // If it was the host that left, or room is completely empty
                gameRoomRepository.delete(room);
                log.info("Deleted empty room {} after player {} left", roomCode, playerName);
            } else {
                log.info("Player {} left room {}", playerName, roomCode);
            }
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

    @Override
    public RoomStateResponse buildRoomStateResponse(String roomCode) {
        Optional<GameRoom> roomOpt = getRoom(roomCode);
        if (roomOpt.isEmpty()) {
            return null;
        }

        GameRoom room = roomOpt.get();
        List<PlayerController> controllers = getRoomPlayers(roomCode);

        List<PlayerInfo> playerInfos = controllers.stream()
                .map(controller -> new PlayerInfo(
                        controller.getPlayerName(),
                        controller.getDeviceId(),
                        controller.getStatus().toString(),
                        controller.isReady(),
                        controller.getScore()
                ))
                .collect(Collectors.toList());

        return new RoomStateResponse(
                room.getRoomCode(),
                room.getRoomName(),
                room.getHostDeviceId(),
                room.getCurrentPlayerCount(),
                room.getMaxPlayers(),
                room.getStatus().toString(),
                playerInfos
        );
    }

    @Transactional
    @Override
    public CreateRoomResult createRoomWithResponse(String roomName, String deviceId) {
        try {
            GameRoom room = createRoom(roomName, deviceId);
            RoomStateResponse roomState = buildRoomStateResponse(room.getRoomCode());

            log.info("Host created room: {} with code: {}", roomName, room.getRoomCode());

            return new CreateRoomResult(room, roomState, true, null);
        } catch (Exception e) {
            log.error("Failed to create room: {}", e.getMessage());
            return new CreateRoomResult(null, null, false, "Failed to create room: " + e.getMessage());
        }
    }

    @Transactional
    @Override
    public JoinRoomResult joinRoomWithResponse(String roomCode, String playerName, String deviceId, String sessionId) {
        try {
            Optional<PlayerController> controllerOpt = joinRoom(roomCode, playerName, deviceId, sessionId);

            if (controllerOpt.isPresent()) {
                PlayerController controller = controllerOpt.get();
                GameRoom room = controller.getGameRoom();

                // Build room state response
                RoomStateResponse roomState = buildRoomStateResponse(room.getRoomCode());

                // Create player action event for host notification
                PlayerActionEvent playerActionEvent = new PlayerActionEvent(
                        room.getRoomCode(),
                        playerName,
                        deviceId,
                        room.getCurrentPlayerCount()
                );

                log.info("Player {} joined room {} as controller", playerName, room.getRoomCode());

                return new JoinRoomResult(controllerOpt, roomState, playerActionEvent, true, null);
            } else {
                String errorMessage = "Unable to join room: " + roomCode;
                log.warn(errorMessage);
                return new JoinRoomResult(Optional.empty(), null, null, false, errorMessage);
            }
        } catch (Exception e) {
            String errorMessage = "Failed to join room: " + e.getMessage();
            log.error(errorMessage);
            return new JoinRoomResult(Optional.empty(), null, null, false, errorMessage);
        }
    }

    @Override
    public void handleControllerInput(String roomCode, String deviceId, ControllerInputEvent event) {
        // First validate that the room exists
        Optional<GameRoom> roomOpt = getRoom(roomCode);
        if (roomOpt.isEmpty()) {
            log.warn("Controller input received for non-existent room: {}", roomCode);
            return;
        }

        // Validate that the device is actually connected to this room
        Optional<PlayerController> controllerOpt =
                playerControllerRepository.findByDeviceIdAndGameRoom_RoomCode(deviceId, roomCode);

        if (controllerOpt.isPresent()) {
            PlayerController controller = controllerOpt.get();

            switch (event.getInputType()) {
                case "READY":
                    controller.setReady(true);
                    playerControllerRepository.save(controller);
                    log.info("Player {} in room {} is now ready", controller.getPlayerName(), roomCode);
                    break;
                case "UNREADY":
                    controller.setReady(false);
                    playerControllerRepository.save(controller);
                    log.info("Player {} in room {} is now unready", controller.getPlayerName(), roomCode);
                    break;
                case "punch_ready":
                    // Handle punch ready state (maybe different from general ready?)
                    // You can implement specific logic here
                    break;
                default:
                    // Handle other input types like "tap", "swipe", etc.
                    log.info("Controller input from device {} in room {}: {}",
                            deviceId, roomCode, event.getInputType());
                    break;
            }
        } else {
            log.warn("Controller input from unregistered device {} in room {}", deviceId, roomCode);
        }
    }

    @Transactional
    @Override
    public PlayerReadyResult handlePlayerReadyWithResponse(String roomCode, String deviceId, ControllerInputEvent event) {
        try {
            // First validate that the room exists
            Optional<GameRoom> roomOpt = getRoom(roomCode);
            if (roomOpt.isEmpty()) {
                log.warn("Player ready request received for non-existent room: {}", roomCode);
                return new PlayerReadyResult("Room not found");
            }

            // Validate that the device is actually connected to this room
            Optional<PlayerController> controllerOpt =
                    playerControllerRepository.findByDeviceIdAndGameRoom_RoomCode(deviceId, roomCode);

            if (controllerOpt.isEmpty()) {
                log.warn("Player ready request from unregistered device {} in room {}", deviceId, roomCode);
                return new PlayerReadyResult("Player not found in room");
            }

            PlayerController controller = controllerOpt.get();
            GameRoom room = roomOpt.get();

            // Update the ready state
            boolean newReadyState = "READY".equals(event.getInputType());
            boolean oldReadyState = controller.isReady();

            if (newReadyState != oldReadyState) {
                controller.setReady(newReadyState);
                playerControllerRepository.save(controller);

                // Build updated room state
                RoomStateResponse roomState = buildRoomStateResponse(room.getRoomCode());

                // Create player action event - using your existing structure
                PlayerActionEvent playerActionEvent = new PlayerActionEvent(
                        room.getRoomCode(),
                        controller.getPlayerName(),
                        deviceId,
                        room.getCurrentPlayerCount()
                );

                log.info("Player {} in room {} is now {}",
                        controller.getPlayerName(), roomCode, newReadyState ? "ready" : "not ready");

                return new PlayerReadyResult(roomState, playerActionEvent);
            } else {
                // No change in state, still return success but no event
                RoomStateResponse roomState = buildRoomStateResponse(room.getRoomCode());
                return new PlayerReadyResult(roomState, null);
            }

        } catch (Exception e) {
            String errorMessage = "Failed to update player ready state: " + e.getMessage();
            log.error(errorMessage, e);
            return new PlayerReadyResult(errorMessage);
        }
    }

    @Transactional
    public void cleanupEmptyRooms() {
        List<GameRoom> emptyRooms = gameRoomRepository.findAll().stream()
                .filter(room -> room.getCurrentPlayerCount() == 0)
                .filter(room -> room.getCreatedAt().isBefore(LocalDateTime.now().minusMinutes(30)))
                .collect(Collectors.toList());

        if (!emptyRooms.isEmpty()) {
            gameRoomRepository.deleteAll(emptyRooms);
            log.info("Cleaned up {} empty rooms", emptyRooms.size());
        }
    }

    @Scheduled(fixedRate = 300000) // Run every 5 minutes
    public void scheduledCleanup() {
        cleanupEmptyRooms();
        cleanupDisconnectedControllers();
    }

    @Transactional
    public void cleanupDisconnectedControllers() {
        // Clean up controllers that have been disconnected for more than 10 minutes
        List<PlayerController> staleControllers = playerControllerRepository.findAll().stream()
                .filter(controller -> controller.getStatus() == PlayerController.ControllerStatus.DISCONNECTED)
                .filter(controller -> controller.getJoinedAt().isBefore(LocalDateTime.now().minusMinutes(10)))
                .collect(Collectors.toList());

        if (!staleControllers.isEmpty()) {
            playerControllerRepository.deleteAll(staleControllers);
            log.info("Cleaned up {} stale controllers", staleControllers.size());
        }
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
        final String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder code = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 4; i++) {
            code.append(chars.charAt(random.nextInt(chars.length())));
        }
        return code.toString();
    }
}