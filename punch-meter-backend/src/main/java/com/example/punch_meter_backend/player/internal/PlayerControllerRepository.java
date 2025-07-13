package com.example.punch_meter_backend.player.internal;

import com.example.punch_meter_backend.player.PlayerController;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerControllerRepository extends JpaRepository<PlayerController, Long> {
    List<PlayerController> findByGameRoom_RoomCode(String roomCode);
    Optional<PlayerController> findByDeviceIdAndGameRoom_RoomCode(String deviceId, String roomCode);
    Optional<PlayerController> findBySessionId(String sessionId);
    void deleteBySessionId(String sessionId);
}