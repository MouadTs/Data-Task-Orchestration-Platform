package com.cloudorchestrator.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.*;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@DynamoDbBean
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    private String taskId;
    private String name;
    private String description;
    private String lambdaFunctionName;
    
    // We use this for the API (Postman sees this)
    private Map<String, Object> parameters = new HashMap<>(); 
    
    private String scheduleExpression;
    private Instant createdAt;
    private Instant updatedAt;

    // Helper to convert JSON
    private static final ObjectMapper objectMapper = new ObjectMapper();

    // --- DYNAMODB CONFIGURATION ---

    @DynamoDbPartitionKey
    @DynamoDbAttribute("taskId")
    public String getTaskId() { return taskId; }

    // 🔴 TRICK: Tell DynamoDB to IGNORE the complex Map
    @DynamoDbIgnore
    public Map<String, Object> getParameters() {
        return parameters;
    }

    // 🟢 TRICK: Tell DynamoDB to save this STRING instead
    @DynamoDbAttribute("parameters")
    public String getParametersJson() {
        try {
            // Convert Map -> JSON String for DB storage
            return objectMapper.writeValueAsString(parameters);
        } catch (JsonProcessingException e) {
            return "{}";
        }
    }

    // When loading from DB: Convert JSON String -> Map
    public void setParametersJson(String json) {
        try {
            if (json != null) {
                this.parameters = objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
            }
        } catch (JsonProcessingException e) {
            this.parameters = new HashMap<>();
        }
    }

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getLambdaFunctionName() {
		return lambdaFunctionName;
	}

	public void setLambdaFunctionName(String lambdaFunctionName) {
		this.lambdaFunctionName = lambdaFunctionName;
	}

	public String getScheduleExpression() {
		return scheduleExpression;
	}

	public void setScheduleExpression(String scheduleExpression) {
		this.scheduleExpression = scheduleExpression;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Instant updatedAt) {
		this.updatedAt = updatedAt;
	}

	public static ObjectMapper getObjectmapper() {
		return objectMapper;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public void setParameters(Map<String, Object> parameters) {
		this.parameters = parameters;
	}
}