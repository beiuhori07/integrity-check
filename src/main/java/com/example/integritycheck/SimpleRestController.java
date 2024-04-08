package com.example.integritycheck;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@Slf4j
public class SimpleRestController {

    private static final Logger logger = LoggerFactory.getLogger(SimpleRestController.class);

    @GetMapping("/log-timestamp")
    public String logTimestamp() {
        LocalDateTime now = LocalDateTime.now();
        logger.info("Endpoint was called at: {}", now);
        return "Timestamp logged: " + now;
    }
}
