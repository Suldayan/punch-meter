package com.example.punch_meter_backend.gameroom;


import com.example.punch_meter_backend.player.PlayerController;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "game_rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String roomCode;

    @Column(nullable = false)
    private String roomName;

    @Column(nullable = false)
    private String hostDeviceId; // The main screen device, particularly a laptop screen or bigger

    private int maxPlayers = 4;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private RoomStatus status = RoomStatus.WAITING;

    @OneToMany(mappedBy = "gameRoom", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PlayerController> controllers = new ArrayList<>();

    public enum RoomStatus {
        WAITING, PLAYING, FINISHED
    }

    public int getCurrentPlayerCount() {
        return controllers.size();
    }
}
