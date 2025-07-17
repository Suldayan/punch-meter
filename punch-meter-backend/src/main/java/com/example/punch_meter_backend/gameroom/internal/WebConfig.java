package com.example.punch_meter_backend.gameroom.internal;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private static final String REST_CONTROLLER_MAPPING = "/api/rooms/**";
    private static final String FRONTEND_URL = "http://localhost:5173";

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping(REST_CONTROLLER_MAPPING)
                .allowedOrigins(FRONTEND_URL)
                .allowedMethods("GET", "POST")
                .allowedHeaders("Content-Type", "Authorization", "X-Requested-With")
                .maxAge(3600);
    }
}