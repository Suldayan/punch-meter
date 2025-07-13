package com.example.punch_meter_backend.gameroom.internal;

import com.example.punch_meter_backend.gameroom.GameRoom;
import com.example.punch_meter_backend.gameroom.GameRoomService;
import com.example.punch_meter_backend.gameroom.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Objects;

@Controller
@RequiredArgsConstructor
@Slf4j
public class GameRoomController {
    private final GameRoomService gameRoomService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/room/create")
    public void createRoom(@Payload CreateRoomRequest request, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();

        CreateRoomResult result = gameRoomService.createRoomWithResponse(
                request.getRoomName(),
                request.getDeviceId()
        );

        if (result.success()) {
            GameRoom room = result.room();

            // Store room info in session attributes
            Objects.requireNonNull(headerAccessor.getSessionAttributes()).put("roomCode", room.getRoomCode());
            headerAccessor.getSessionAttributes().put("deviceId", request.getDeviceId());
            headerAccessor.getSessionAttributes().put("isHost", true);

            // Send response to host
            messagingTemplate.convertAndSend("/topic/room/" + room.getRoomCode() + "/host", result.roomState());
        } else {
            messagingTemplate.convertAndSend("/topic/error/" + sessionId,
                    new ErrorResponse(result.errorMessage()));
        }
    }

    @MessageMapping("/room/join")
    public void joinRoom(@Payload JoinRoomRequest request, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();

        JoinRoomResult result = gameRoomService.joinRoomWithResponse(
                request.getRoomCode(),
                request.getPlayerName(),
                request.getDeviceId(),
                sessionId
        );

        if (result.success() && result.controller().isPresent()) {
            GameRoom room = result.controller().get().getGameRoom();

            // Store controller info in session
            Objects.requireNonNull(headerAccessor.getSessionAttributes()).put("roomCode", room.getRoomCode());
            headerAccessor.getSessionAttributes().put("deviceId", request.getDeviceId());
            headerAccessor.getSessionAttributes().put("playerName", request.getPlayerName());
            headerAccessor.getSessionAttributes().put("isHost", false);

            var consolidatedMessage = new GameUpdateMessage(
                    result.roomState(),
                    result.playerActionEvent(),
                    request.getDeviceId(),
                    System.currentTimeMillis()
            );

            messagingTemplate.convertAndSend("/topic/room/" + room.getRoomCode() + "/updates", consolidatedMessage);
        } else {
            messagingTemplate.convertAndSend("/topic/room/" + request.getRoomCode() + "/controller/" + request.getDeviceId(),
                    new ErrorResponse(result.errorMessage()));
        }
    }

    @MessageMapping("/controller/input")
    public void handleControllerInput(@Payload ControllerInputEvent event, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        String roomCode = (String) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("roomCode");
        String deviceId = (String) headerAccessor.getSessionAttributes().get("deviceId");

        if (roomCode != null && deviceId != null) {
            gameRoomService.handleControllerInput(roomCode, deviceId, event);

            // Forward input to main screen
            messagingTemplate.convertAndSend("/topic/room/" + roomCode + "/host", event);
        } else {
            log.warn("Controller input received with invalid session data. Session: {}", sessionId);
        }
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        gameRoomService.leaveRoom(sessionId);

        log.info("Session disconnected: {}", sessionId);
    }
}