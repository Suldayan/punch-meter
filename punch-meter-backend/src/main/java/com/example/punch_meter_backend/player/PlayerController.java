package com.example.punch_meter_backend.player;

import com.example.punch_meter_backend.gameroom.GameRoom;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "player_controllers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerController {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String playerName;

    @Column(nullable = false)
    private String deviceId; // Phone/controller device ID

    @Column(nullable = false)
    private String sessionId; // WebSocket session ID

    private LocalDateTime joinedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private GameRoom gameRoom;

    @Enumerated(EnumType.STRING)
    private ControllerStatus status = ControllerStatus.CONNECTED;

    // For future punch meter game (just like in the arcade, the max score will be 999)
    private int score = 0;
    private boolean isReady = false;

    public enum ControllerStatus {
        CONNECTED, DISCONNECTED, PLAYING
    }
}