package com.example.punch_meter_backend.websocket;

import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ErrorHandlerController {

    @MessageExceptionHandler
    @SendTo("topics/errors")
    public String handleException(Exception e) {
        return "Error: " + e.getMessage();
    }
}
