package com.example.punch_meter_backend.websocket;

import com.example.punch_meter_backend.auth.JwtUtils;
import jakarta.annotation.Nonnull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthInterceptor implements HandshakeInterceptor {
    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    @Override
    public boolean beforeHandshake(
            @Nonnull ServerHttpRequest request,
            @Nonnull ServerHttpResponse response,
            @Nonnull WebSocketHandler wsHandler,
            @Nonnull Map<String, Object> attributes) throws Exception {

        String token = extractToken(request);

        if (isValidToken(token)) {
            String username = jwtUtils.getUserNameFromJwtToken(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            attributes.put("user", userDetails);
            attributes.put("username", username);
            return true;
        }

        return false;
    }

    @Override
    public void afterHandshake(
            @Nonnull ServerHttpRequest request,
            @Nonnull ServerHttpResponse response,
            @Nonnull WebSocketHandler wsHandler,
            Exception exception) {
        log.info("After Handshake returned successfully");
    }

    private String extractToken(@Nonnull ServerHttpRequest request) {
        String authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7); // Remove "Bearer " prefix
        }

        String query = request.getURI().getQuery();
        if (query != null && query.contains("token=")) {
            String[] params = query.split("&");
            for (String param : params) {
                if (param.startsWith("token=")) {
                    return param.substring(6);
                }
            }
        }

        return null;
    }

    private boolean isValidToken(String token) {
        if (token == null || token.isEmpty()) {
            return false;
        }

        try {
            return jwtUtils.validateJwtToken(token);
        } catch (Exception e) {
            log.error("Unexpected error caught while validating jwt token: {}", e.getMessage());
            return false;
        }
    }
}