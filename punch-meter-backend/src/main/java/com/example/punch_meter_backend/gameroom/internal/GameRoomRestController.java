package com.example.punch_meter_backend.gameroom.internal;

import com.example.punch_meter_backend.gameroom.GameRoomService;
import com.example.punch_meter_backend.gameroom.dto.CreateRoomRequest;
import com.example.punch_meter_backend.gameroom.dto.ErrorResponse;
import com.example.punch_meter_backend.gameroom.dto.RoomStateResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@Slf4j
public class GameRoomRestController {
    private final GameRoomService gameRoomService;

    @PostMapping("/create")
    public ResponseEntity<?> createRoom(@RequestBody CreateRoomRequest request) {
        CreateRoomResult result = gameRoomService.createRoomWithResponse(
                request.getRoomName(),
                request.getDeviceId()
        );

        if (result.success()) {
            return ResponseEntity.ok(result.roomState());
        } else {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(result.errorMessage()));
        }
    }

    @GetMapping("/{roomCode}/exists")
    public ResponseEntity<Boolean> roomExists(@PathVariable String roomCode) {
        boolean exists = gameRoomService.getRoom(roomCode).isPresent();
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/{roomCode}")
    public ResponseEntity<?> getRoomState(@PathVariable String roomCode) {
        RoomStateResponse roomState = gameRoomService.buildRoomStateResponse(roomCode);
        if (roomState != null) {
            return ResponseEntity.ok(roomState);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}