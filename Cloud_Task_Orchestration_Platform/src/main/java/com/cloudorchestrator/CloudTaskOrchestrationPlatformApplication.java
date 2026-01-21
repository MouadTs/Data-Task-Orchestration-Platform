package com.cloudorchestrator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CloudTaskOrchestrationPlatformApplication {

	public static void main(String[] args) {
		SpringApplication.run(CloudTaskOrchestrationPlatformApplication.class, args);
	}

}


