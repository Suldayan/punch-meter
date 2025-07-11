package com.example.punch_meter_backend.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.messaging.simp.SimpMessagingTemplate;

@Service
@RequiredArgsConstructor
public class WebSocketService {
    private final SimpMessagingTemplate messagingTemplate;

    public void sendMessage(String username, String message) {
        messagingTemplate.convertAndSendToUser(username, "/queue/reply", message);
    }
}