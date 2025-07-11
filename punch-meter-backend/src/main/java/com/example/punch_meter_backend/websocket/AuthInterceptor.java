package com.example.punch_meter_backend.websocket;

import jakarta.annotation.Nonnull;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

public class AuthInterceptor implements HandshakeInterceptor {
    @Override
    public boolean beforeHandshake(
            @Nonnull ServerHttpRequest request,
            @Nonnull ServerHttpResponse response,
            @Nonnull WebSocketHandler wsHandler,
            @Nonnull Map<String, Object> attributes) throws Exception {
        String token = extractToken(request);
        return isValidToken(token);
    }

    @Override
    public void afterHandshake(
            @Nonnull ServerHttpRequest request,
            @Nonnull ServerHttpResponse response,
            @Nonnull WebSocketHandler wsHandler,
            Exception exception) {

    }
}
