package com.example.integritycheck;

import java.time.LocalDateTime;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class SimpleRestController {

  private static final Logger logger = LoggerFactory.getLogger("ayooo");

  @GetMapping("/log-timestamp")
  public String logTimestamp() {
    org.slf4j.MDC.put("loggingSmartContractAddress", "0xac8bfeffaaa90e092a7c4709a9cda36f9cdf9e03");

    LocalDateTime now = LocalDateTime.now();
    logger.info("Endpoint was called at: {}", now);
    return "Timestamp logged: " + now;
  }
}
